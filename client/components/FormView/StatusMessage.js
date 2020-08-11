import React from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'

const translations = {
  savingAnswersNotice: {
    fi: 'Vastaukset tallentuvat automaattisesti. Eräpäivä:',
    en: 'Answers are saved automatically. Deadline:',
    se: 'Svaren sparas automatiskt.',
  },
  savingAnswersSubtitle: {
    fi: 'Viimeksi tallennettu',
    en: 'Last saved',
    se: 'Senast sparat',
  },
  lockedFormNotice: {
    fi: 'Lomake on lukittu, eikä sitä voi muokata.',
    en: 'The form has been locked and it cannot be edited.',
    se: 'The form has been locked and it cannot be edited.',
  },
  lockedFormSubtitle: {
    fi: 'Lomakkeen omistaja voi vielä avata lomakkeen ennen sen eräpäivää',
    en: 'The owner of the form may still unlock the form before its deadline',
    se: 'The owner of the form may still unlock the form before its deadline.',
  },
  deadlinePassedNotice: {
    fi: 'Lomakeen täyttöaika on päättynyt.',
    en: 'The deadline to edit form has passed.',
    se: 'The deadline to edit form has passed.',
  },
  deadlinePassedSubtitle: {
    fi: 'OSPA käsittelee vastaukset.',
    en: 'OSPA will process the answers.',
    se: 'OSPA will process the answers.',
  },
}

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
