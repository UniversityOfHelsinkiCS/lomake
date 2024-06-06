import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const MetaTable = ({ programmes, questions, answers }) => {
  const lang = useSelector(state => state.language)

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Programme / Question</th>
          {questions.map((question, index) => (
            <th key={question.id}>{index + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {programmes.map(programme => (
          <tr key={programme.id}>
            <td>
              <Link to={`/meta-evaluation/form/${programme.key}`}>{programme.name[lang]}</Link>
            </td>
            {questions.map(question => {
              const programmeAnswers = answers.data.find(answer => answer.programme === programme.key)
              const answerStatus =
                programmeAnswers && programmeAnswers.data[`${question.id}_text`] !== undefined ? 'Filled' : 'Not Filled'
              return <td key={question.id}>{answerStatus}</td>
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MetaTable
