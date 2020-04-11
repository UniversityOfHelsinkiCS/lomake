import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Message, Progress } from 'semantic-ui-react'

const translations = {
  EMPTY: {
    header: {
      fi: 'Vastaukset tallentuvat automaattisesti',
      en: 'Answers are saved automatically',
      se: '',
    },
    subtitle: {
      fi: 'Vimeinen täyttöpäivä 15.10.',
      en: 'Deadline 15.10.',
      se: '',
    },
  },
  INPROGRESS: {
    header: {
      fi: 'Vastaukset tallentuvat automaattisesti',
      en: 'Answers are saved automatically',
      se: '',
    },
    subtitle: {
      fi: 'Vimeinen täyttöpäivä 15.10.',
      en: 'Deadline 15.10.',
      se: '',
    },
  },
  COMPLETE: {
    header: {
      fi: 'Lomake täytetty onnistuneesti',
      en: 'The form has been filled succesfully',
      se: '',
    },
    subtitle: {
      fi: 'Vastausten päivittäminen ennen viimeista täyttöpäivää 15.10. mahdollista',
      en: 'Editing possible before the deadline on 15.10.',
      se: '',
    },
  },
  progressBarLabel: {
    fi: 'kohtaa valmis',
    en: 'sections ready',
    se: '',
  },
}

const nextProgress = {
  EMPTY: 'INPROGRESS',
  INPROGRESS: 'COMPLETE',
  COMPLETE: 'EMPTY',
}

const messageIcon = {
  EMPTY: 'info',
  INPROGRESS: 'info',
  COMPLETE: 'checkmark',
}

const percentage = {
  EMPTY: 0,
  INPROGRESS: 40,
  COMPLETE: 100,
}

const partsFilled = {
  EMPTY: 0,
  INPROGRESS: 4,
  COMPLETE: 7,
}

const StatusMessage = () => {
  const [progress, setProgress] = useState('EMPTY')
  const languageCode = useSelector((state) => state.language)

  return (
    <>
      <Message
        positive={progress === 'COMPLETE'}
        warning={progress === 'INPROGRESS'}
        icon={messageIcon[progress]}
        header={translations[progress].header[languageCode]}
        content={translations[progress].subtitle[languageCode]}
        onClick={() => setProgress(nextProgress[progress])}
      />
      <Progress
        percent={percentage[progress]}
        color="blue"
        label={`${partsFilled[progress]}/7 ${translations.progressBarLabel[languageCode]}`}
      />
    </>
  )
}

export default StatusMessage
