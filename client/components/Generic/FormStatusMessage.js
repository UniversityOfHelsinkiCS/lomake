import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Card } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { isAdmin } from '@root/config/common'
import './Generic.scss'

const FormStatusMessage = ({ programme }) => {
  const { t } = useTranslation()
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
      <Card
        onDismiss={() => setVisible(false)}
        color="teal"
        header={t('generic:statusHeader', { year: draftYear ? draftYear.year : '' })}
        content={`${t('generic:statusMessage')}${deadlineDate.toLocaleDateString(locale)}.`}
      />
    </div>
  )
}

export default FormStatusMessage
