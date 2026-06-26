import Alert from '@mui/material/Alert'
import { useTranslation } from 'react-i18next'

const StatusMessage = () => {
  const { t } = useTranslation()
  const deadlineObj = undefined

  if (!deadlineObj)
    return (
      <Alert data-cy="deadline-passed-notice" severity="info">
        {`${t('formView:status:deadlinePassed')}`}
      </Alert>
    )

  return <Alert data-cy="no-write-access-notice" severity="info">{`${t('formView:status:viewOnly')}}.`}</Alert>
}

export default StatusMessage
