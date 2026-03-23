import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { formKeys } from '../../../config/data'

const showMessageForOpenYear = (draftYear, writeAccess, t) => {
  if (draftYear && writeAccess) {
    return `${draftYear.year} ${t('formView:status:open')}`
  }
  return ''
}

const StatusMessage = ({ form, writeAccess = false }) => {
  const { t } = useTranslation()
  const deadlines = useSelector(state => state.deadlines.nextDeadline)
  const formDeadline = deadlines ? deadlines.find(d => d.form === form) : null
  const draftYear = useSelector(state => state.deadlines.draftYear)
  const lastSaved = useSelector(state => state.form.lastSaveSuccess)
  const viewOnly = useSelector(state => state.form.viewOnly)
  const deadlineObj = formDeadline?.date ? new Date(formDeadline.date) : undefined
  const date = lastSaved ? new Date(lastSaved) : null

  if (
    form === formKeys.META_EVALUATION &&
    deadlineObj &&
    deadlineObj.getUTCHours() === 0 &&
    deadlineObj.getUTCMinutes() === 0
  ) {
    // Subtract one minute
    deadlineObj.setUTCHours(deadlineObj.getUTCHours() - 2)
    deadlineObj.setUTCMinutes(deadlineObj.getUTCMinutes() - 1)
  }

  const locale = 'fi'

  if (form !== 3 && !writeAccess) {
    return (
      <Message
        data-cy="no-write-access-notice"
        header={`${t('formView:status:viewOnly')} ${showMessageForOpenYear(draftYear, writeAccess, t)}`}
        icon="lock"
      />
    )
  }

  if (!deadlineObj)
    return (
      <Message
        content={`${t('formView:status:prosessing')}`}
        data-cy="deadline-passed-notice"
        header={`${t('formView:status:deadlinePassed')}`}
        icon="clock"
      />
    )

  if (viewOnly)
    return (
      <Message
        content={`${t('formView:status:canBeOpened')} ${deadlineObj.toLocaleString(locale)}.`}
        data-cy="locked-form-notice"
        header={`${t('formView:status:locked')} ${showMessageForOpenYear(draftYear, writeAccess, t)}`}
        icon="lock"
      />
    )

  return (
    <Message
      content={`${t('lastSaved')} ${date ? date.toLocaleString(locale) : ''}`}
      data-cy="saving-answers-notice"
      header={`${t('formView:savingAnswers')} ${deadlineObj.toLocaleString(locale)}.`}
      icon="info"
    />
  )
}

export default StatusMessage
