import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { isAdmin } from '@root/config/common'
import './Generic.scss'

// TO FIX
const FormStatusMessage = ({ programme, form = 1 }) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const user = useSelector(state => state.currentUser.data)
  const lang = useSelector(state => state.language)
  const year = useSelector(state => state.filters.year)
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === form) : null

  const deadlineDate = formDeadline && formDeadline.date ? new Date(formDeadline.date) : undefined
  const locale = lang !== 'se' ? lang : 'sv'
  const writeAccess = (user.access[programme] && user.access[programme].write) || isAdmin(user)

  useEffect(() => {
    if (formDeadline && draftYear && draftYear.year !== year && writeAccess) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [formDeadline, draftYear, year, writeAccess, user])

  if (!draftYear || !formDeadline || !visible) return null

  return (
    <div className="form-status-message-sticky hide-in-print-mode">
      <Message
        onDismiss={() => setVisible(false)}
        color="teal"
        header={t('generic:statusHeader', { year: draftYear ? draftYear.year : '' })}
        content={`${t('generic:statusMessage')}${deadlineDate.toLocaleDateString(locale)}.`}
      />
    </div>
  )
}

export default FormStatusMessage
