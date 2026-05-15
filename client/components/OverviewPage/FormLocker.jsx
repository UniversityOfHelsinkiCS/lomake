/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Popover from '@mui/material/Popover'
import { Button } from '@mui/material'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'
import { useTranslation } from 'react-i18next'
import { toggleLock, getProgramme } from '../../redux/studyProgrammesReducer'
import { isFormLocked } from '../../util/common'

// eslint-disable-next-line react/function-component-definition
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

  const [anchorEl, setAnchorEl] = useState(null)

  const handleToggleClick = e => {
    setAnchorEl(e.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

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
    dispatch(toggleLock(programme, form))
  }

  if (!formDeadline || !programmeDetails) return null
  const locked = isFormLocked(form, programmeDetails.lockedForms)

  const open = Boolean(anchorEl)

  return (
    <div style={{ margin: '2em 3em 0em 3em', display: 'flex' }}>
      <Button
        data-cy={`formLocker-button-${locked ? 'open' : 'close'}`}
        disabled={!loadObj.loaded || programmeDetailsPending}
        onClick={handleToggleClick}
        startIcon={locked ? <LockIcon style={{ color: 'black' }} /> : <LockOpenIcon style={{ color: 'black' }} />}
        variant="outlined"
      >
        {locked ? t('overview:formLocked') : t('overview:formUnlocked')}
      </Button>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        id={open ? 'form-locker-popover' : undefined}
        onClose={handlePopoverClose}
        open={open}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <div style={{ padding: '0.5em' }}>
          <Button
            color="error"
            data-cy={`formLocker-verify-${locked ? 'open' : 'close'}-button`}
            onClick={() => {
              handleLock()
              handlePopoverClose()
            }}
            variant="contained"
          >
            {locked ? t('overview:unlockForm') : t('overview:lockForm')}
          </Button>
        </div>
      </Popover>
    </div>
  )
}
