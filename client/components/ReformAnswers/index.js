/* eslint-disable no-restricted-syntax */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getReformAnswers } from 'Utilities/redux/reformAnswerReducer'

import { degreeReformIndividualQuestions as questionData } from '../../questionData'

const lang = 'fi'

const Question = ({ question, answers }) => {
  const values = {
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    fifth: 0,
    idk: 0,
    nop: 0,
  }

  const { id, label } = question

  for (const answer of answers) {
    const valOf = answer.data[id]
    if (valOf) {
      values[valOf] += 1
    } else {
      values.nop += 1
    }
  }

  return (
    <div>
      <h4>{label[lang]}</h4>
      <table>
        <tbody>
          <tr>
            <td>strong disagree</td>
            <td>somehow disagree</td>
            <td>neutral</td>
            <td>somehow agree</td>
            <td>strong agree</td>
            <td>dunno</td>
            <td>no opinion</td>
          </tr>
          <tr>
            <td>{values.first}</td>
            <td>{values.second}</td>
            <td>{values.third}</td>
            <td>{values.fourth}</td>
            <td>{values.fifth}</td>
            <td>{values.idk}</td>
            <td>{values.nop}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const QuestionGroup = ({ questionGroup, answers }) => {
  const relevantParts = questionGroup.parts.filter(q => q.type === 'CHOOSE-RADIO')
  return (
    <div style={{ margin: 10 }}>
      <h3>{questionGroup.title[lang]}</h3>
      {relevantParts.map(part => (
        <Question key={part.id} question={part} answers={answers} />
      ))}
    </div>
  )
}

export default () => {
  const dispatch = useDispatch()
  const answers = useSelector(state => state.reformAnswers)

  useEffect(() => {
    dispatch(getReformAnswers())
  }, [])

  if (!answers.data || answers.pending || answers.error) {
    return null
  }

  const questionGroup = questionData[1]

  return (
    <div>
      <h1>reform answers</h1>

      <strong>this many has answered {answers.data.length}</strong>

      <QuestionGroup questionGroup={questionGroup} answers={answers.data} />
    </div>
  )
}
