import React from 'react'
// import { useSelector } from 'react-redux'

// import yearlyQuestions from '../../questions.json'

const OldAnswersSummary = ({ partId, relatedYearlyAnswers }) => {
  // console.log(partId, yearlyAnswers)
  const keys = relatedYearlyAnswers ? Object.keys(relatedYearlyAnswers) : []
  return (
    <>
      <h4>Here be summary for {partId}</h4>
      {keys.map(k => (
        <p>{k}</p>
      ))}
    </>
  )
}

export default OldAnswersSummary
