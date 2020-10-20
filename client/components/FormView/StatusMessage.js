import React from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'
import { formViewTranslations as translations } from 'Utilities/translations'


const StatusMessage = () => {
  const languageCode = useSelector((state) => state.language)
  const deadline = useSelector((state) => state.deadlines.nextDeadline)
  const lastSaved = useSelector((state) => state.form.lastSaveSuccess)
  const viewOnly = useSelector((state) => state.form.viewOnly)

  const deadlineObj = deadline && deadline.date ? new Date(deadline.date) : undefined

  const locale = languageCode != 'se' ? languageCode : 'sv'

  if (!deadlineObj)
    return (
      <>
        <Message
        data-cy="deadline-passed-notice"
        icon="clock"
        header={`${translations.deadlinePassedNotice[languageCode]}`}
        content={`${translations.deadlinePassedSubtitle[languageCode]}`}
        />
      </>
    )

  if (viewOnly)
    return (
      <>
        <Message
        data-cy="locked-form-notice"
        icon="lock"
        header={`${translations.lockedFormNotice[languageCode]}`}
        content={`${translations.lockedFormSubtitle[languageCode]} ${deadlineObj.toLocaleDateString(locale)}.`}
        />
      </>
    )

  return (
    <Message
      data-cy="saving-answers-notice"
      icon="info"
      header={`${translations.savingAnswersNotice[languageCode]} ${deadlineObj.toLocaleDateString(locale)}.`}
      content={`${translations.savingAnswersSubtitle[languageCode]} ${lastSaved.toLocaleString(locale)}.`}
    />
  )
}

export default StatusMessage
