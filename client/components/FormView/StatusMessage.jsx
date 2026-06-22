import { useSelector } from 'react-redux'
import Alert from '@mui/material/Alert'
import { useTranslation } from 'react-i18next'

const showMessageForOpenYear = (draftYear, writeAccess, t) => {
  if (draftYear && writeAccess) {
    return `${draftYear.year} ${t('formView:status:open')}`
  }
  return ''
}

const StatusMessage = () => {
  const { t } = useTranslation()
  const draftYear = useSelector(state => state.deadlines.draftYear)
  const deadlineObj = undefined

  if (!deadlineObj)
    return (
      <Alert data-cy="deadline-passed-notice" severity="info">
        {`${t('formView:status:deadlinePassed')}`}
      </Alert>
    )

  return (
    <Alert
      data-cy="no-write-access-notice"
      severity="info"
    >{`${t('formView:status:viewOnly')} ${showMessageForOpenYear(draftYear, false, t)}.`}</Alert>
  )
}

export default StatusMessage
