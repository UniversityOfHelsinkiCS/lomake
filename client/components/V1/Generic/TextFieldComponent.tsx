import { useState, useEffect, useRef } from 'react'
import { TextField, Button, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { getLockHttp, updateFormField } from '../../../util/redux/formReducer'
import { RootState } from '../../../util/store'
import { releaseFieldLocally } from '../../../util/redux/currentEditorsReducer'
import { deepCheck } from '../../Generic/Textarea'
import { updateReportHttp } from '../../../util/redux/reportsReducer'

const TextFieldComponent = ({ id, type }: { id: string; type: string }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [content, setContent] = useState<string>('')
  const [hasLock, setHasLock] = useState<boolean>(true)
  const [gettingLock, setGettingLock] = useState<boolean>(false)

  const room = useSelector((state: RootState) => state.room)
  const dataFromRedux = useSelector(({ form }: { form: any }) => form.data[id] || '')
  const currentEditors = useSelector(({ currentEditors }: { currentEditors: any }) => currentEditors.data, deepCheck)
  const currentUser = useSelector(({ currentUser }: { currentUser: any }) => currentUser.data)

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
    dispatch(updateReportHttp(room, 2025, id, content))
    dispatch(updateFormField(id, content, 10))
  }

  const askForLock = () => {
    if (!hasLock && !gettingLock && currentEditors && !currentEditors[id]) {
      setGettingLock(true)
      dispatch(getLockHttp(id, room))
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start' }}>
      {hasLock ? (
        <>
          <TextField
            type="text"
            defaultValue={content}
            variant="outlined"
            multiline
            minRows={type === 'comment' ? 3 : 10}
            fullWidth
            label="Koulutusohjelman kommentti"
            value={content}
            onChange={e => setContent(e.target.value)}
            onClick={askForLock}
          />
          <Button variant="outlined" onClick={handleStopEditing}>
            {t('generic:kludgeButton')}
          </Button>
        </>
      ) : (
        <>
          <ReactMarkdown>{content}</ReactMarkdown>
          <Button variant="outlined" onClick={askForLock}>
            {t('edit')}
          </Button>
        </>
      )}
    </Box>
  )
}

export default TextFieldComponent
