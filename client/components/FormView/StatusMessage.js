import React from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'

const translations = {
  header: {
    fi: 'Vastaukset tallentuvat automaattisesti. Eräpäivä:',
    en: 'Answers are saved automatically. Deadline:',
    se: '',
  },
  subtitle: {
    fi: 'Viimeksi tallennettu',
    en: 'Last saved',
    se: '',
  },
}

const StatusMessage = () => {
  const languageCode = useSelector((state) => state.language)
  const deadline = useSelector((state) => state.deadlines.nextDeadline.date)
  const lastSaved = useSelector((state) => state.form.lastSaved)

  const deadlineObj = new Date(deadline)
  const locale = languageCode != 'se' ? languageCode : 'sv'

  return (
    <>
      <Message
        icon="info"
        header={`${translations.header[languageCode]} ${deadlineObj.toLocaleDateString(locale)}`}
        content={`${translations.subtitle[languageCode]} ${lastSaved.toLocaleString(locale)}`}
      />
    </>
  )
}

export default StatusMessage
