import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const translations = {
  expandText: {
    fi: 'Näytä viime vuoden vastaukset',
    en: 'Show answers from last year',
    se: 'Visa fjolårets svar',
  },
  collapseText: {
    fi: 'Piilota viime vuoden vastaukset',
    en: 'Hide answers from last year',
    se: 'Dölj fjolårets svar',
  },
}

const LastYearsAnswersAccordion = ({ children }) => {
  const [expanded, setExpanded] = useState(false)
  const languageCode = useSelector((state) => state.language)
  const viewingOldAnswers = useSelector((state) => state.form.viewingOldAnswers)

  // When viewing old answers, theres really no need to show even "older" answers.
  if (viewingOldAnswers) return null

  return (
    <div>
      {expanded && <blockquote>{children}</blockquote>}
      <span
        style={{
          cursor: 'pointer',
          color: '#4183C4',
          float: 'right',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? translations.collapseText[languageCode] : translations.expandText[languageCode]}
      </span>
    </div>
  )
}

export default LastYearsAnswersAccordion
