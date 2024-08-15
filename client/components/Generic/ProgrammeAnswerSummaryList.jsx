import React from 'react'
import ReactMarkdown from 'react-markdown'

const ProgrammeAnswerSummaryList = ({ data, lang, onlyBc, showText, showSpecific, handleShowSpecific }) => {
  if (onlyBc || !data) {
    return <div />
  }
  return data.map(p => {
    return (
      <div key={p.key}>
        <p key={`${p.name[lang]}`}>
          <span className="answer-circle-green" />{' '}
          <span
            className="programme-list-button"
            onClick={() => handleShowSpecific(p.key)}
            style={{ marginLeft: '0.5em' }}
          >
            {p.name[lang]}
          </span>
        </p>
        {(showText || showSpecific[p.key]) && data[p.key] && <ReactMarkdown>{data[p.key]}</ReactMarkdown>}
      </div>
    )
  })
}

export default ProgrammeAnswerSummaryList
