import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Icon, Popup } from 'semantic-ui-react'
import { toggleLock, getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { overviewPageTranslations as translations } from 'Utilities/translations'

export default function FormLocker({ programme }) {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const programmeDetails = useSelector(state => state.studyProgrammes.singleProgram)
  const programmeDetailsPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const nextDeadline = useSelector(({ deadlines }) => deadlines.nextDeadline)

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

  if (!nextDeadline || !programmeDetails) return null

  const { locked } = programmeDetails

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
            {locked ? translations.lockedTriggerButtonText[lang] : translations.unlockedTriggerButtonText[lang]}
          </Button>
        }
        content={
          <Button
            data-cy={`formLocker-verify-${locked ? 'open' : 'close'}-button`}
            color="red"
            secondary
            content={locked ? translations.unLockForm[lang] : translations.lockForm[lang]}
            onClick={handleLock}
          />
        }
        on="click"
        position="top center"
      />
    </div>
  )
}
