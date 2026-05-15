import 'react-datepicker/dist/react-datepicker.css'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { forms } from '../../../config/data'
import { Alert, Typography } from '@mui/material'

const DeadlineInfo = () => {
  const { t } = useTranslation()
  const { draftYear, nextDeadline } = useSelector(({ deadlines }) => deadlines)

  const formatDate = date => {
    const temp = new Date(date)
    return `${temp.getDate()}.${temp.getMonth() + 1}.${temp.getFullYear()}`
  }

  const getDeadlineText = () => {
    if (nextDeadline?.length > 0)
      return (
        <>
          {nextDeadline.map(deadline => {
            return (
              <>
                <Typography variant="h3">{forms.find(f => f.key === deadline.form)?.name}</Typography>
                <p>
                  {t('users:nextDeadline')} {formatDate(deadline.date)}
                </p>
                <p>**</p>
              </>
            )
          })}
          <p>
            {t('users:answersSavedForYear')} {draftYear.year}
          </p>
          <p>{t('users:contactToska')}</p>
        </>
      )
    return (
      <>
        {t('users:noDeadlineSet')}
        {t('users:contactToska')}
      </>
    )
  }

  return (
    <Alert icon={false} severity="info" sx={{ width: '100%', marginTop: 2, justifyContent: 'center' }}>
      <Typography sx={{ textAlign: 'center' }} variant="h4">
        {getDeadlineText()}
      </Typography>
    </Alert>
  )
}

export default DeadlineInfo
