import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const expandText = {
  fi: 'Näytä viime vuoden vastaukset',
  en: 'Show answers from last year',
  se: '',
}

const collapseText = {
  fi: 'Piilota viime vuoden vastaukset',
  en: 'Hide answers from last year',
  se: '',
}

const LastYearsAnswersAccordion = ({ children }) => {
  const [expanded, setExpanded] = useState(false)
  const languageCode = useSelector((state) => state.language)
  return (
    <>
      <span
        style={{
          cursor: 'pointer',
          color: 'blue',
          textDecoration: 'underline',
          marginLeft: '0.5em',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? collapseText[languageCode] : expandText[languageCode]}
      </span>
      {expanded && (
        <div
          style={{
            marginTop: '1em',
            backgroundColor: '#F4F4F4',
            borderRadius: '5px',
            padding: '1em',
          }}
        >
          {children}
        </div>
      )}
    </>
  )
}

export default LastYearsAnswersAccordion
