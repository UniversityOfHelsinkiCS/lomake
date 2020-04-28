import React from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'

const translations = {
  header: {
    fi: 'Vastaukset tallentuvat automaattisesti. Eräpäivä:',
    en: 'Answers are saved automatically. Deadline:',
    se: ''
  },
  subtitle: {
    fi: 'Viimeksi tallennettu',
    en: 'Last saved',
    se: ''
  }
}

const StatusMessage = ({ deadlineTimestamp, lastSavedTimeStamp }) => {
  const languageCode = useSelector((state) => state.language)

  const deadline = new Date(deadlineTimestamp)
  const lastSaved = new Date(lastSavedTimeStamp)

  return (
    <>
      <Message
        icon="info"
        header={`${translations.header[languageCode]} ${deadline.toLocaleString()}`}
        content={`${translations.subtitle[languageCode]} ${lastSaved.toLocaleString()}`}
      />
    </>
  )
}

export default StatusMessage
