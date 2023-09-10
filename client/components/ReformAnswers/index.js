/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Divider, Radio } from 'semantic-ui-react'
import { getReformAnswers } from 'Utilities/redux/reformAnswerReducer'
import { degreeReformIndividualQuestions as questionData } from '../../questionData'

import RadioQuestion from './RadioQuestion'
import TextQuestion from './TextQuestion'

const RadioQuestionGroup = ({ questionGroup, answers }) => {
  const lang = useSelector(state => state.language)
  const relevantParts = questionGroup.parts.filter(q => q.type === 'CHOOSE-RADIO')
  return (
    <div style={{ margin: 30, marginBottom: 10 }}>
      <h3 style={{ marginBotton: 10 }}>{questionGroup.title[lang]}</h3>
      {relevantParts.map(part => (
        <RadioQuestion key={part.id} question={part} answers={answers} />
      ))}
      <div style={{ marginTop: 10 }} />
      <Divider />
    </div>
  )
}

const TextQuestionGroup = ({ questionGroup, answers }) => {
  const lang = useSelector(state => state.language)
  const relevantParts = questionGroup.parts.filter(q => q.type === 'TEXTAREA')

  return (
    <div style={{ margin: 30, marginBottom: 10 }}>
      <h3 style={{ marginBotton: 10 }}>{questionGroup.title[lang]}</h3>
      {relevantParts.map(part => (
        <TextQuestion key={part.id} question={part} answers={answers} />
      ))}
      <div style={{ marginTop: 10 }} />
      <Divider />
    </div>
  )
}

export default () => {
  const [form, setForm] = useState('textual')
  const dispatch = useDispatch()
  const answers = useSelector(state => state.reformAnswers)

  useEffect(() => {
    dispatch(getReformAnswers())
  }, [])

  if (!answers.data || answers.pending || answers.error) {
    return null
  }

  return (
    <div>
      <h1>Reform answers</h1>

      <strong>Number of opened forms {answers.data.length}</strong>

      <div style={{ marginTop: 30 }}>
        <div>
          <Radio
            label="Numerical answers"
            name="answerSelection"
            checked={form === 'number'}
            onChange={() => setForm('number')}
          />
        </div>
        <div>
          <Radio
            label="Text answers"
            name="answerSelection"
            checked={form === 'textual'}
            onChange={() => setForm('textual')}
          />
        </div>
      </div>

      {form === 'textual' ? (
        <>
          {questionData.slice(1).map(group => (
            <TextQuestionGroup key={group.id} questionGroup={group} answers={answers.data} />
          ))}
        </>
      ) : (
        <>
          {questionData.map(group => (
            <RadioQuestionGroup key={group.id} questionGroup={group} answers={answers.data} />
          ))}
        </>
      )}
    </div>
  )
}
