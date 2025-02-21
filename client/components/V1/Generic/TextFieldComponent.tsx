import { useState, useEffect } from 'react'
import { TextField, Button, Box, Card, Avatar, CardHeader, CardContent } from '@mui/material'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import CurrentEditor from '../../Generic/CurrentEditor'
import { getLockHttp } from '../../../util/redux/formReducer'
import { RootState } from '../../../util/store'
import { releaseFieldLocally } from '../../../util/redux/currentEditorsReducer'
import { deepCheck } from '../../Generic/Textarea'
import { updateReportHttp } from '../../../util/redux/reportsSlicer'

type TextFieldComponentProps = {
  id: string
  type: string
}

const TextFieldComponent = ({ id, type }: TextFieldComponentProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [content, setContent] = useState<string>('')
  const [hasLock, setHasLock] = useState<boolean>(true)
  const [gettingLock, setGettingLock] = useState<boolean>(false)

  const year = 2025
  const room = useSelector((state: RootState) => state.room)
  const dataFromRedux = useSelector(({ reports }: { reports: Record<string, any> }) => reports.data[id] || '')
  const currentEditors = useSelector(
    ({ currentEditors }: { currentEditors: Record<string, any> }) => currentEditors.data,
    deepCheck,
  )
  const currentUser = useSelector(({ currentUser }: { currentUser: Record<string, any> }) => currentUser.data)
  const someOneElseEditing = currentEditors && currentEditors[id] && currentEditors[id].uid !== currentUser.uid
  const viewOnly = useSelector(({ form }: { form: Record<string, any> }) => form.viewOnly)

  useEffect(() => {
    const gotTheLock = currentEditors && currentEditors[id] && currentEditors[id].uid === currentUser.uid
    setHasLock(gotTheLock)
    if (gettingLock && currentEditors[id]) {
      setGettingLock(false)
    }
  }, [currentEditors])

  useEffect(() => {
    if (!hasLock) setContent(dataFromRedux)
  }, [dataFromRedux, hasLock])

  const handleStopEditing = () => {
    setHasLock(false)
    dispatch(releaseFieldLocally(id))
    dispatch(updateReportHttp({ room, year, id, content }))
  }

  const askForLock = () => {
    if (!hasLock && !gettingLock && currentEditors && !currentEditors[id]) {
      setGettingLock(true)
      dispatch(getLockHttp(id, room))
    }
  }

  if (viewOnly) {
    return (
      <>
        <p>{t(`keyData:${type}`)}</p>
        <Card variant="outlined" sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          {type === 'Comment' && (
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'white', color: 'gray' }}>
                  <ChatBubbleIcon />
                </Avatar>
              }
            />
          )}
          <CardContent>
            <ReactMarkdown>{content ? content : t(`keyData:no${type}`)}</ReactMarkdown>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start' }}>
      <p>{t(`keyData:${type}`)}</p>
      {hasLock ? (
        <>
          <TextField
            type="text"
            defaultValue={content}
            variant="outlined"
            multiline
            minRows={type === 'Comment' ? 2.1 : 10}
            fullWidth
            label={t(`keyData:${type}`)}
            value={content}
            onChange={e => setContent(e.target.value)}
            onClick={askForLock}
            InputProps={
              type === 'Comment' && {
                startAdornment: (
                  <Avatar sx={{ bgcolor: 'white', color: 'gray', marginRight: 2, marginLeft: 0.4 }}>
                    <ChatBubbleIcon />
                  </Avatar>
                ),
              }
            }
          />
          <Box>
            <Button variant="contained" onClick={handleStopEditing} sx={{ marginRight: 2 }}>
              {t(`keyData:save${type}`)}
            </Button>
            {dataFromRedux !== content && <span style={{ color: 'red' }}>{t('keyData:unsavedChanges')}</span>}
          </Box>
        </>
      ) : (
        <>
          <Card variant="outlined" sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            {type === 'Comment' && (
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'white', color: 'gray' }}>
                    <ChatBubbleIcon />
                  </Avatar>
                }
              />
            )}
            <CardContent>
              <ReactMarkdown>{content ? content : t(`keyData:no${type}`)}</ReactMarkdown>
            </CardContent>
          </Card>
          <Button variant="contained" disabled={someOneElseEditing} onClick={askForLock} sx={{ marginRight: 2 }}>
            {t(`keyData:edit${type}`)}
          </Button>
          <CurrentEditor fieldName={id} />
        </>
      )}
    </Box>
  )
}

export default TextFieldComponent
