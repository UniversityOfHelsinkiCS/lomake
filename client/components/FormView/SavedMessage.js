import React from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'

const translations = {
  successTitle: {
    fi: 'Lomake tallennettu',
    en: 'Form saved',
    se: ''
  },
  successSubtitle: {
    fi: 'Viimeksi lähetetty',
    en: 'Last sent',
    se: ''
  }
}

const SavedMessage = ({ answers }) => {
  const languageCode = useSelector((state) => state.language)

  if (answers.length === 0) return null

  //later could also add here times submitted, who submitted last etc.
  return (
    <Message
      positive
      icon="checkmark"
      header={translations.successTitle[languageCode]}
      content={`${translations.successSubtitle[languageCode]}: ${new Date(
        answers[0].createdAt
      ).toLocaleString()}`}
    />
  )
}

export default SavedMessage
