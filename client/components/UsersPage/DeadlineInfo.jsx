import React from 'react'
import { Header, Message } from 'semantic-ui-react'
import 'react-datepicker/dist/react-datepicker.css'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { forms } from '@root/config/data'

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
                <Header as="h3">{forms.find(f => f.key === deadline.form)?.name}</Header>
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
    <Message>
      <Header as="h4" style={{ textAlign: 'center' }}>
        {getDeadlineText()}
      </Header>
    </Message>
  )
}

export default DeadlineInfo
