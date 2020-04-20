import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
import { toggleLock, getProgramme } from 'Utilities/redux/studyProgrammesReducer'

export default function FormLocker({ programme }) {
  const languageCode = useSelector((state) => state.language)
  const dispatch = useDispatch()
  const programmeDetails = useSelector((state) => state.studyProgrammes.singleProgram)
  const programmeDetailsPending = useSelector((state) => state.studyProgrammes.singleProgramPending)

  const [locked, setLocked] = useState(undefined)
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
      setLocked(programmeDetails.locked)
    }
  }, [programmeDetails, loadObj])

  const translations = {
    lockForm: {
      en: 'Lock form (prevents editing)',
      fi: 'Lukitse lomake',
      se: '',
    },
    unLockForm: {
      en: 'Unlock form',
      fi: 'Poista lukitus',
      se: '',
    },
  }

  const handleLock = () => {
    dispatch(toggleLock(programme))
    setLocked(!locked)
  }

  return (
    <tr>
      <td colSpan={100}>
        <div style={{ margin: '2em 3em 0em 3em', display: 'flex' }}>
          <Button
            color={locked ? 'green' : 'red'}
            disabled={!loadObj.loaded || programmeDetailsPending}
            onClick={handleLock}
            icon
            labelPosition="left"
          >
            <Icon name={locked ? 'lock open' : 'lock'} />
            {locked ? translations.unLockForm[languageCode] : translations.lockForm[languageCode]}
          </Button>
        </div>
      </td>
    </tr>
  )
}
