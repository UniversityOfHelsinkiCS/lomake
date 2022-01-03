import React, { useEffect } from 'react'
import { Header, Message } from 'semantic-ui-react'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch, useSelector } from 'react-redux'
import { getDeadline } from 'Utilities/redux/deadlineReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'

const DeadlineInfo = () => {
  const lang = useSelector(state => state.language)
  const nextDeadline = useSelector(({ deadlines }) => deadlines.nextDeadline)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getDeadline())
  }, [])

  const formatDate = date => {
    const temp = new Date(date)
    return `${temp.getDate()}.${temp.getMonth() + 1}.${temp.getFullYear()}`
  }

  const getDeadlineText = () => {
    if (nextDeadline)
      return (
        <>
          {translations.nextDeadline[lang]} {formatDate(nextDeadline.date)}
          <p>{translations.contactToska[lang]}</p>
        </>
      )
    return (
      <>
        {translations.noDeadlineSet[lang]}
        {translations.contactToska[lang]}
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
