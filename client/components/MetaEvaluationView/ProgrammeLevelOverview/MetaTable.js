import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const MetaTable = ({ programmes, questions }) => {
  const lang = useSelector(state => state.language)
  const isQuestionFilled = (programmeId, questionId) => {
    // Replace this with your logic to determine if a question is filled
    // For demonstration, let's assume an object where this data is stored
    const filledQuestions = {
      1: { 1: true, 2: false },
      2: { 1: true, 2: true },
    }

    return filledQuestions[programmeId] && filledQuestions[programmeId][questionId]
  }
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Programme / Question</th>
          {questions.map(question => (
            <th key={question.id}>{question}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {programmes.map(programme => (
          <tr key={programme.id}>
            <td>
              <Link to={`/meta-evaluation/form/${programme.key}`}>{programme.name[lang]}</Link>
            </td>
            {questions.map(question => (
              <td key={question.id}>{isQuestionFilled(programme.id, question.id) ? 'Filled' : 'Not Filled'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MetaTable
