import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { TextField, Button, Box, Card, Avatar, CardHeader, CardContent, Typography } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import ReactMarkdown from 'react-markdown'
import CurrentEditor from '../../Generic/CurrentEditor'
import { getLockHttp } from '../../../redux/formReducer'
import { releaseFieldLocally } from '../../../redux/currentEditorsReducer'
import { deepCheck } from '../../Generic/Textarea'
import { getReports, updateReportHttp } from '../../../redux/reportsSlice'
import { useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/client/util/hooks'

type TextFieldComponentProps = {
  id: string
  type: string
  children?: React.ReactNode // for passing notification badges next to textfield title
}

export const TextFieldCard = ({ id, t, type }: { id: string; t: TFunction; type: string }) => {
  const content = useSelector(({ reports }: { reports: Record<string, any> }) => reports.data[id] || '')
  return (
    <Box sx={{ mt: '1rem' }} data-cy="textfield-viewonly">
      <Typography variant="h5" color="textSecondary" sx={{ mb: '1.5rem' }}>
        {t(`keyData:${type}`)}
      </Typography>
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'row',
          minHeight: type !== 'Comment' ? '19rem' : undefined,
        }}
      >
        {type === 'Comment' && (
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'white', color: 'gray' }}>
                <ChatBubbleOutlineIcon sx={{ fontSize: 30 }} />
              </Avatar>
            }
            sx={{
              '& .MuiCardHeader-avatar': {
                marginRight: 0,
              },
            }}
          />
        )}
        <CardContent
          sx={{
            paddingLeft: type === 'Comment' ? 0 : undefined,
            minWidth: 0,
            overflowWrap: 'break-word',
            alignSelf: 'center',
          }}
        >
          {content ? (
            <Typography variant="regular">
              <ReactMarkdown>{content}</ReactMarkdown>
            </Typography>
          ) : (
            <Typography variant="italic">{t(`keyData:no${type}`)}</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

const TextFieldComponent = ({ id, type, children }: TextFieldComponentProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [content, setContent] = useState<string>('')
  const [hasLock, setHasLock] = useState<boolean>(false)
  const [gettingLock, setGettingLock] = useState<boolean>(false)

  const year = useAppSelector(state => state.filters.keyDataYear)
  const { programme: room } = useParams<{ programme: string }>()
  const dataFromRedux = useSelector(({ reports }: { reports: Record<string, any> }) => reports.data[id] || '')
  const currentEditors = useSelector(
    ({ currentEditors }: { currentEditors: Record<string, any> }) => currentEditors.data,
    deepCheck,
  )
  const currentUser = useSelector(({ currentUser }: { currentUser: Record<string, any> }) => currentUser.data)
  const isSomeoneElseEditing = currentEditors && currentEditors[id] && currentEditors[id].uid !== currentUser.uid
  const viewOnly = useSelector(({ form }: { form: Record<string, any> }) => form.viewOnly)

  const textFieldRef = useRef<HTMLInputElement>(null)
  const componentRef = useRef<HTMLDivElement>(null)

  const hasUnsavedChanges = hasLock && dataFromRedux !== content

  const MAX_CONTENT_LENGTH = type === 'Comment' ? 1000 : 5000

  useEffect(() => {
    const gotTheLock = currentEditors && currentEditors[id] && currentEditors[id].uid === currentUser.uid
    setHasLock(gotTheLock)
    if (gettingLock && currentEditors[id]) {
      setGettingLock(false)
    }
    // Do not add currentUser or dataFromRedux to the dependencies
    // it will clear the field if lock is released by the server
  }, [currentEditors])

  useEffect(() => {
    if (!hasLock) setContent(dataFromRedux)
    dispatch(getReports({ year }))
  }, [dataFromRedux])

  useEffect(() => {
    if (hasLock && textFieldRef.current) {
      textFieldRef.current.focus()
      textFieldRef.current.selectionStart = content.length
    }
  }, [hasLock])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        hasUnsavedChanges &&
        componentRef.current &&
        !componentRef.current.contains(e.target as Node) &&
        document.body.contains(e.target as Node)
      ) {
        const confirm = window.confirm(t('keyData:unsavedChangesWarning'))
        if (confirm) {
          handleStopEditing()
        } else {
          e.preventDefault()
          e.stopPropagation()
          componentRef.current.focus()
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [hasUnsavedChanges, t, dataFromRedux, content])

  const handleStopEditing = () => {
    setHasLock(false)
    dispatch(releaseFieldLocally(id))
    dispatch(updateReportHttp({ room, year, id, content }))
  }

  const askForLock = () => {
    if (!hasLock && !gettingLock && currentEditors && currentEditors[id] === undefined) {
      setGettingLock(true)
      dispatch(getLockHttp(id, room))
    }
  }

  if (viewOnly) {
    return <TextFieldCard id={id} t={t} type={type} />
  }

  return (
    <Box
      data-cy={`box-${id}-${type}`}
      ref={componentRef}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start', mt: '1rem' }}
    >
      <div style={{ display: 'flex', alignContent: 'center', gap: 10 }}>
        <Typography variant="h5" color="textSecondary">
          {t(`keyData:${type}`)}
        </Typography>
        {children}
      </div>
      {hasLock || content !== dataFromRedux ? (
        <>
          <TextField
            style={{}}
            data-cy={`editor-${id}-${type}`}
            type="text"
            variant="outlined"
            multiline
            minRows={type === 'Comment' ? 1 : 10}
            fullWidth
            inputRef={textFieldRef}
            value={content}
            onChange={e => {
              if (e.target.value.length <= MAX_CONTENT_LENGTH) {
                setContent(e.target.value)
              }
            }}
            onPaste={e => {
              const paste = e.clipboardData.getData('text')
              const newLength = content.length + paste.length
              if (newLength > MAX_CONTENT_LENGTH) {
                e.preventDefault()
                alert(t('generic:tooLongPaste', { newLength, MAX_LENGTH: MAX_CONTENT_LENGTH }))
              }
            }}
            slotProps={{
              input: {
                ...(type === 'Comment' && {
                  startAdornment: (
                    <Avatar sx={{ bgcolor: 'white', color: 'gray', marginRight: 2, marginLeft: 0.4 }}>
                      <ChatBubbleOutlineIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                  ),
                }),
              },
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Box sx={{ mt: '1rem' }}>
              <Button
                data-cy={`save-${id}-${type}`}
                variant="contained"
                onClick={handleStopEditing}
                sx={{ marginRight: 2 }}
              >
                {t(`keyData:save${type}`)}
              </Button>
              {content !== dataFromRedux && (
                <Typography variant="regular" style={{ color: 'red' }}>
                  {t('keyData:unsavedChanges')}!
                </Typography>
              )}
              {hasLock && content === dataFromRedux && (
                <Typography variant="regular" style={{ color: 'gray' }}>
                  {t('generic:textUnsavedRelease')}
                </Typography>
              )}
            </Box>
            <Typography variant="regularSmall" style={{ color: 'gray', marginTop: '1rem' }}>
              {content.length} / {MAX_CONTENT_LENGTH}
            </Typography>
          </div>
        </>
      ) : (
        <>
          <Card
            variant="outlined"
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'row',
              minHeight: type !== 'Comment' ? '18.75rem' : undefined,
            }}
          >
            {type === 'Comment' && (
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'white', color: 'gray' }}>
                    <ChatBubbleOutlineIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                }
                sx={{
                  '& .MuiCardHeader-avatar': {
                    marginRight: 0,
                  },
                }}
              />
            )}
            <CardContent
              sx={{
                paddingLeft: type === 'Comment' ? 0 : undefined,
                minWidth: 0,
                overflowWrap: 'break-word',
                alignSelf: type === 'Comment' ? 'center' : undefined,
              }}
            >
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <Typography variant="italic" color="textSecondary">
                  {t(`keyData:no${type}`)}
                </Typography>
              )}
            </CardContent>
          </Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              marginTop: '1rem',
            }}
          >
            <Box sx={{}}>
              <Button
                data-cy={`edit-${id}-${type}`}
                variant="outlined"
                disabled={isSomeoneElseEditing}
                onClick={askForLock}
                sx={{ marginRight: 2 }}
              >
                {t(`keyData:edit${type}`)}
              </Button>

              <CurrentEditor fieldName={id} />
            </Box>
            <Typography variant="regularSmall" style={{ color: 'gray' }}>
              {content.length} / {MAX_CONTENT_LENGTH}
            </Typography>
          </div>
        </>
      )}
    </Box>
  )
}

export default TextFieldComponent
