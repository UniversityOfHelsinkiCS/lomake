import React, { useState, useEffect, useRef } from 'react'
import { TextField, Button, Box, Card, Avatar, CardHeader, CardContent, Typography } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import CurrentEditor from '../../Generic/CurrentEditor'
import { useGetReportQuery } from '../../../redux/reports'
import { useParams } from 'react-router'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchLockQuery } from '@/client/redux/lock'
import { TextFieldCard } from './TextFieldCard'
import { useLockSync } from '@/client/hooks/useLockSync'
import { ReportDataKey } from '@/client/lib/types'

type TextFieldComponentProps = {
  id: ReportDataKey
  type: string
  children?: React.ReactNode // for passing notification badges next to textfield title
}

const TextFieldComponent = ({ id, type, children }: TextFieldComponentProps) => {
  const { programme: studyprogrammeKey } = useParams<{ programme: string }>()
  const { t } = useTranslation()
  const year = useAppSelector(state => state.filters.keyDataYear)
  const currentUser = useAppSelector(({ currentUser }: { currentUser: Record<string, any> }) => currentUser.data)
  const viewOnly = useAppSelector(({ form }: { form: Record<string, any> }) => form.viewOnly)
  const { data, isLoading } = useGetReportQuery({ studyprogrammeKey, year }, {
    pollingInterval: 1000,
  })
  const { data: lockMap } = useFetchLockQuery({ room: studyprogrammeKey }, {
    pollingInterval: 1000
  })
  const dataFromRedux = (!isLoading && data[id]) ? data[id] : ''
  const isSomeoneElseEditing = lockMap && lockMap[id] && lockMap[id].uid !== currentUser.uid

  const [content, setContent] = useState<string>('')

  const { hasLock, askForLock, handleStopEditing } = useLockSync({ id, content, dataFromRedux, studyprogrammeKey, year })

  const textFieldRef = useRef<HTMLInputElement>(null)
  const componentRef = useRef<HTMLDivElement>(null)

  const hasUnsavedChanges = hasLock && dataFromRedux !== content

  const MAX_CONTENT_LENGTH = type === 'Comment' ? 1000 : 5000

  useEffect(() => {
    if (!hasLock) setContent(dataFromRedux)
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

  if (viewOnly) {
    return <TextFieldCard id={id} t={t} type={type} studyprogrammeKey={studyprogrammeKey} />
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
