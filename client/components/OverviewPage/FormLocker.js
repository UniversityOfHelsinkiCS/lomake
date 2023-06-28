import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Icon, Popup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { toggleLock, getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { isFormLocked } from 'Utilities/common'

// TO FIX
export default function FormLocker({ programme, form = 1 }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const programmeDetails = useSelector(state => state.studyProgrammes.singleProgram)
  const programmeDetailsPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const nextDeadline = useSelector(({ deadlines }) => deadlines.nextDeadline)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === form) : null

  const [loadObj, setLoadObj] = useState({
    loading: false,
    loaded: false,
  })

  useEffect(() => {
    dispatch(getProgramme(programme)) // Refresh if old is stale
    setLoadObj({
      loading: true,
      loaded: false,
    })
  }, [])

  useEffect(() => {
    if (programmeDetails && loadObj.loading) {
      setLoadObj({
        loading: false,
        loaded: true,
      })
    }
  }, [programmeDetails, loadObj])

  const handleLock = () => {
    dispatch(toggleLock(programme))
  }

  if (!formDeadline || !programmeDetails) return null
  const locked = isFormLocked(form, programmeDetails.lockedForms)

  return (
    <div style={{ margin: '2em 3em 0em 3em', display: 'flex' }}>
      <Popup
        trigger={
          <Button
            data-cy={`formLocker-button-${locked ? 'open' : 'close'}`}
            disabled={!loadObj.loaded || programmeDetailsPending}
            icon
            labelPosition="left"
          >
            <Icon name={locked ? 'lock' : 'lock open'} />
            {locked ? t('overview:formLocked') : t('overview:formUnlocked')}
          </Button>
        }
        content={
          <Button
            data-cy={`formLocker-verify-${locked ? 'open' : 'close'}-button`}
            color="red"
            secondary
            content={locked ? t('overview:unlockForm') : t('overview:lockForm')}
            onClick={handleLock}
          />
        }
        on="click"
        position="top center"
      />
    </div>
  )
}
