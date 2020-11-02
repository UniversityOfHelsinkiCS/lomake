import React from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'
import { formViewTranslations as translations } from 'Utilities/translations'


const StatusMessage = () => {
  const lang = useSelector((state) => state.language)
  const deadline = useSelector((state) => state.deadlines.nextDeadline)
  const lastSaved = useSelector((state) => state.form.lastSaveSuccess)
  const viewOnly = useSelector((state) => state.form.viewOnly)

  const deadlineObj = deadline && deadline.date ? new Date(deadline.date) : undefined

  const locale = lang != 'se' ? lang : 'sv'

  if (!deadlineObj)
    return (
      <>
        <Message
        data-cy="deadline-passed-notice"
        icon="clock"
        header={`${translations.deadlinePassedNotice[lang]}`}
        content={`${translations.deadlinePassedSubtitle[lang]}`}
        />
      </>
    )

  if (viewOnly)
    return (
      <>
        <Message
        data-cy="locked-form-notice"
        icon="lock"
        header={`${translations.lockedFormNotice[lang]}`}
        content={`${translations.lockedFormSubtitle[lang]} ${deadlineObj.toLocaleDateString(locale)}.`}
        />
      </>
    )

  return (
    <Message
      data-cy="saving-answers-notice"
      icon="info"
      header={`${translations.savingAnswersNotice[lang]} ${deadlineObj.toLocaleDateString(locale)}.`}
      content={`${translations.savingAnswersSubtitle[lang]} ${lastSaved.toLocaleString(locale)}.`}
    />
  )
}

export default StatusMessage
