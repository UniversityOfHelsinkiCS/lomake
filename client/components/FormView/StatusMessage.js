import React from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'

const translations = {
  header: {
    fi: 'Vastaukset tallentuvat automaattisesti. Eräpäivä:',
    en: 'Answers are saved automatically. Deadline:',
    se: 'Svaren sparas automatiskt.',
  },
  subtitle: {
    fi: 'Viimeksi tallennettu',
    en: 'Last saved',
    se: 'Senast sparat',
  },
}

const StatusMessage = () => {
  const languageCode = useSelector((state) => state.language)
  const deadline = useSelector((state) => state.deadlines.nextDeadline)
  const lastSaved = useSelector((state) => state.form.lastSaveSuccess)

  const deadlineObj = deadline && deadline.date ? new Date(deadline.date) : undefined

  if (!deadlineObj) return null

  const locale = languageCode != 'se' ? languageCode : 'sv'

  return (
    <>
      <Message
        data-cy="statusMessage"
        icon="info"
        header={`${translations.header[languageCode]} ${deadlineObj.toLocaleDateString(locale)}`}
        content={`${translations.subtitle[languageCode]} ${lastSaved.toLocaleString(locale)}`}
      />
    </>
  )
}

export default StatusMessage
