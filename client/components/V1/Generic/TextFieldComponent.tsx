import { useState, useEffect, useRef } from 'react'
import { TextField, Button, Box, Card, Avatar, CardHeader, CardContent, Typography } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import CurrentEditor from '../../Generic/CurrentEditor'
import { getLockHttp } from '../../../util/redux/formReducer'
import { RootState } from '../../../util/store'
import { releaseFieldLocally } from '../../../util/redux/currentEditorsReducer'
import { deepCheck } from '../../Generic/Textarea'
import { updateReportHttp } from '../../../util/redux/reportsSlicer'
import { has } from 'lodash'

type TextFieldComponentProps = {
  id: string
  type: string
}

const TextFieldComponent = ({ id, type }: TextFieldComponentProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [content, setContent] = useState<string>('')
  const [hasLock, setHasLock] = useState<boolean>(false)
  const [gettingLock, setGettingLock] = useState<boolean>(false)

  const year = useSelector((state: RootState) => state.filters.keyDataYear)
  const room = useSelector((state: RootState) => state.room)
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

  const MAX_CONTENT_LENGTH = type === 'Comment' ? 500 : 5000

  useEffect(() => {
    const gotTheLock = currentEditors && currentEditors[id] && currentEditors[id].uid === currentUser.uid
    setHasLock(gotTheLock)
    if (gettingLock && currentEditors[id]) {
      setGettingLock(false)
    }
    // Do not add currentUser or dataFromRedux to the dependencies
    // it will clear the field if lock is relesed by the server
  }, [currentEditors])

  useEffect(() => {
    if (!hasLock) setContent(dataFromRedux)
  }, [dataFromRedux, hasLock])

  useEffect(() => {
    if (hasLock && textFieldRef.current) {
      textFieldRef.current.focus()
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
          setContent(dataFromRedux)
          handleStopEditing()
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [hasUnsavedChanges, t])

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
    return (
      <>
        <Typography variant="h5" color="textSecondary">
          {t(`keyData:${type}`)}
        </Typography>
        <Card variant="outlined" sx={{ width: '100%', display: 'flex', alignItems: 'center', mt: 2 }}>
          {type === 'Comment' && (
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'white', color: 'gray' }}>
                  <ChatBubbleOutlineIcon />
                </Avatar>
              }
              sx={{
                '& .MuiCardHeader-avatar': {
                  marginRight: 0,
                },
              }}
            />
          )}
          <CardContent sx={{ paddingLeft: type === 'Comment' ? 0 : undefined }}>
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <Typography variant="italic">{t(`keyData:no${type}`)}</Typography>
            )}
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <Box
      data-cy={`box-${id}-${type}`}
      ref={componentRef}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start' }}
    >
      <Typography variant="h5" color="textSecondary">
        {t(`keyData:${type}`)}
      </Typography>
      {hasLock ? (
        <>
          <TextField
            data-cy={`editor-${id}-${type}`}
            type="text"
            variant="outlined"
            multiline
            minRows={type === 'Comment' ? 2.1 : 10}
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
            <Box>
              <Button
                data-cy={`save-${id}-${type}`}
                variant="contained"
                onClick={handleStopEditing}
                sx={{ marginRight: 2 }}
              >
                {t(`keyData:save${type}`)}
              </Button>
              {hasUnsavedChanges && (
                <Typography variant="regular" style={{ color: 'red' }}>
                  {t('keyData:unsavedChanges')}!
                </Typography>
              )}
              {hasLock && !hasUnsavedChanges && (
                <Typography variant="regular" style={{ color: 'gray' }}>
                  {t('generic:textUnsavedRelease')}
                </Typography>
              )}
            </Box>
            <Typography variant="regularSmall" style={{ color: 'gray' }}>
              {content.length} / {MAX_CONTENT_LENGTH}
            </Typography>
          </div>
        </>
      ) : (
        <>
          <Card variant="outlined" sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
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
            <CardContent sx={{ paddingLeft: type === 'Comment' ? 0 : undefined }}>
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <Typography variant="italic" color="textSecondary">
                  {t(`keyData:no${type}`)}
                </Typography>
              )}
            </CardContent>
          </Card>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Button
              data-cy={`edit-${id}-${type}`}
              variant="contained"
              disabled={isSomeoneElseEditing}
              onClick={askForLock}
              sx={{ marginRight: 2 }}
            >
              {t(`keyData:edit${type}`)}
            </Button>
            <CurrentEditor fieldName={id} />
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
