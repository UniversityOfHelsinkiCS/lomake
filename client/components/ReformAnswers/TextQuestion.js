/* eslint-disable no-restricted-syntax */
import React from 'react'

const Question = ({ question, answers }) => {
  const { id } = question

  const textualAnswers = []
  for (const answer of answers) {
    const key = `${id}_text`
    const answerData = answer.data
    if (answerData[key]) {
      textualAnswers.push(answerData[key])
    }
  }

  return (
    <div style={{ marginTop: 20, marginLeft: 20 }}>
      <ul>
        {textualAnswers.map((a, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  )
}

export default Question
