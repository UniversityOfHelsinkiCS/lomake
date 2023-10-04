import React from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { isAdmin } from '@root/config/common'

const showMessageForOpenYear = (draftYear, writeAccess, t) => {
  if (draftYear && writeAccess) {
    return `${draftYear.year} ${t('formView:status:open')}`
  }
  return ''
}

const StatusMessage = ({ programme, form }) => {
  const { t } = useTranslation()
  const deadlines = useSelector(state => state.deadlines.nextDeadline)
  const formDeadline = deadlines ? deadlines.find(d => d.form === form) : null
  const draftYear = useSelector(state => state.deadlines.draftYear)
  const lastSaved = useSelector(state => state.form.lastSaveSuccess)
  const viewOnly = useSelector(state => state.form.viewOnly)
  const user = useSelector(state => state.currentUser.data)
  const writeAccess = (user.access[programme] && user.access[programme].write) || isAdmin(user)
  const deadlineObj = formDeadline && formDeadline.date ? new Date(formDeadline.date) : undefined

  const locale = 'fi'

  if (form !== 3 && !writeAccess) {
    return (
      <Message
        data-cy="no-write-access-notice"
        icon="lock"
        header={`${t('formView:status:viewOnly')} ${showMessageForOpenYear(draftYear, writeAccess, t)}`}
      />
    )
  }

  if (!deadlineObj)
    return (
      <>
        <Message
          data-cy="deadline-passed-notice"
          icon="clock"
          header={`${t('formView:status:deadlinePassed')}`}
          content={`${t('formView:status:prosessing')}`}
        />
      </>
    )

  if (viewOnly)
    return (
      <Message
        data-cy="locked-form-notice"
        icon="lock"
        header={`${t('formView:status:locked')} ${showMessageForOpenYear(draftYear, writeAccess, t)}`}
        content={`${t('formView:status:canBeOpened')} ${deadlineObj.toLocaleDateString(locale)}.`}
      />
    )

  return (
    <>
      <Message
        data-cy="saving-answers-notice"
        icon="info"
        header={`${t('formView:savingAnswers')} ${deadlineObj.toLocaleDateString(locale)}.`}
        content={`${t('lastSaved')} ${lastSaved.toLocaleString(locale)}`}
      />
      {/* form === 3 && formData.data && <LastFormSentMessage /> Deprecated since sending forms is not a thing */}
    </>
  )
}

export default StatusMessage
