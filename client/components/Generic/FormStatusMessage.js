import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'

import { isAdmin } from '@root/config/common'
import { genericTranslations as translations } from 'Utilities/translations'
import './Generic.scss'

const FormStatusMessage = ({ programme }) => {
  const [visible, setVisible] = useState(false)
  const user = useSelector(state => state.currentUser.data)
  const lang = useSelector(state => state.language)
  const year = useSelector(state => state.filters.year)
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)

  const deadlineDate = nextDeadline && nextDeadline.date ? new Date(nextDeadline.date) : undefined
  const locale = lang !== 'se' ? lang : 'sv'
  const writeAccess = (user.access[programme] && user.access[programme].write) || isAdmin(user)

  useEffect(() => {
    if (nextDeadline && draftYear && draftYear.year !== year && writeAccess) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [nextDeadline, draftYear, year, writeAccess, user])

  if (!draftYear || !nextDeadline || !visible) return null

  return (
    <div className="form-status-message-sticky hide-in-print-mode">
      <Message
        onDismiss={() => setVisible(false)}
        color="teal"
        header={`
          ${translations.formStatusMessagePart1[lang]} ${draftYear && draftYear.year}
          ${translations.formStatusMessagePart2[lang]}`}
        content={`${translations.formStatusMessagePart3[lang]}${deadlineDate.toLocaleDateString(locale)}.`}
      />
    </div>
  )
}

export default FormStatusMessage
