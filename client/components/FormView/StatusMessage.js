import React from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'
import { formViewTranslations as translations } from 'Utilities/translations'

const showMessageForOpenYear = (draftYear, writeAccess, lang) => {
  if (draftYear && writeAccess) {
    return `${draftYear.year} ${translations.lockedFormNoticePart2[lang]}`
  }
  return ''
}

const StatusMessage = ({ programme }) => {
  const lang = useSelector(state => state.language)
  const deadline = useSelector(state => state.deadlines.nextDeadline)
  const draftYear = useSelector(state => state.deadlines.draftYear)
  const lastSaved = useSelector(state => state.form.lastSaveSuccess)
  const viewOnly = useSelector(state => state.form.viewOnly)
  const user = useSelector(state => state.currentUser.data)
  const writeAccess = (user.access[programme] && user.access[programme].write) || user.admin
  const deadlineObj = deadline && deadline.date ? new Date(deadline.date) : undefined

  const locale = lang !== 'se' ? lang : 'sv'

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
          header={`${translations.lockedFormNoticePart1[lang]} ${showMessageForOpenYear(draftYear, writeAccess, lang)}`}
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
