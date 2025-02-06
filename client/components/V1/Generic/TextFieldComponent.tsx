import { useState, useEffect } from 'react'
import { TextField, Button, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { getLockHttp } from '@/client/util/redux/formReducer'
import { RootState } from '@/client/util/store'
import { wsJoinRoom } from '@/client/util/redux/websocketReducer'
import { releaseFieldLocally } from '@/client/util/redux/currentEditorsReducer'
import { updateReportHttp, getReports } from '@/client/util/redux/reportsReducer'
import { deepCheck } from '@/client/components/Generic/Textarea'

const TextFieldComponent = ({ id }: { id: string }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [content, setContent] = useState<string>('')
  const [hasLock, setHasLock] = useState<boolean>(true)
  const [gettingLock, setGettingLock] = useState<boolean>(false)

  const room = useSelector((state: RootState) => state.room)
  const dataFromRedux = useSelector(({ form }: { form: any }) => form.data[id] || '')
  const currentEditors = useSelector(({ currentEditors }: { currentEditors: any }) => currentEditors.data, deepCheck)
  const currentUser = useSelector(({ currentUser }: { currentUser: any }) => currentUser.data)
  const form = 10

  useEffect(() => {
    dispatch(getReports('KH50_005'))
    dispatch(wsJoinRoom('KH50_005', form))
  }, [])

  useEffect(() => {
    const gotTheLock = (currentEditors && currentEditors[id] && currentEditors[id].uid === currentUser.uid)
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
    dispatch(updateReportHttp(room, 2025, id, content))
  }

  const askForLock = () => {
    if (!hasLock && !gettingLock && currentEditors && !currentEditors[id]) {
      setGettingLock(true)
      dispatch(getLockHttp(id, room))
    }
  }

  const handleStartEditing = () => {
    askForLock()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start' }}>
      <TextField
        disabled={!hasLock}
        type="text"
        defaultValue={content}
        variant="outlined"
        multiline
        minRows={8}
        fullWidth
        label="Testattava tekstikenttä"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      {hasLock ? (
        <Button variant="contained" onClick={handleStopEditing}>
          {t('stopEditing')}
        </Button>
      ) : (
        <Button variant="contained" onClick={handleStartEditing}>
          {t('edit')}
        </Button>
      )}
      <ReactMarkdown>{content}</ReactMarkdown>
    </Box>
  )
}

export default TextFieldComponent
