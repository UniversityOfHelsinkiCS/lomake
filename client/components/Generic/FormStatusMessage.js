import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'
import { genericTranslations as translations } from 'Utilities/translations'
import './Generic.scss'

const FormStatusMessage = ({ writeAccess }) => {
  const [visible, setVisible] = useState(false)
  const lang = useSelector(state => state.language)
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const currentYear = new Date().getFullYear()

  const deadlineDate = nextDeadline && nextDeadline.date ? new Date(nextDeadline.date) : undefined
  const locale = lang !== 'se' ? lang : 'sv'

  useEffect(() => {
    if (nextDeadline && draftYear && draftYear.year !== currentYear && writeAccess) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [nextDeadline, draftYear])

  if (!draftYear || !nextDeadline || !visible) return null

  return (
    <div className="form-status-message-sticky">
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