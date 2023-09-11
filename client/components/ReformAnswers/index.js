import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Divider, Radio, Loader } from 'semantic-ui-react'
import { getReformAnswers } from 'Utilities/redux/reformAnswerReducer'
import { degreeReformIndividualQuestions as questionData } from '../../questionData'

import RadioQuestion from './RadioQuestion'
import TextQuestion from './TextQuestion'
import AnswerFilter from './AnswerFilter'

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
  const [form, setForm] = useState('number')
  const [filters, setFilters] = useState([])
  const dispatch = useDispatch()
  const answers = useSelector(state => state.reformAnswers)

  useEffect(() => {
    dispatch(getReformAnswers())
  }, [])

  if (!answers.data || answers.pending || answers.error) {
    return (
      <div>
        <h1>Reform answers</h1>
        <Loader active inline="centered" />
      </div>
    )
  }

  const filterList = a => {
    const stripPossibleUserInput = v => {
      const splitPoint = v.indexOf('_-_')
      return splitPoint === -1 ? v : v.slice(0, splitPoint)
    }

    if (filters.length === 0) {
      return true
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const filter of filters) {
      const key = Object.keys(filter)[0]
      const value = filter[key]

      if (stripPossibleUserInput(a.data[key]) !== value) return false
    }

    return true
  }

  const answerData = answers.data.filter(filterList)

  return (
    <div>
      <h1>Reform answers</h1>

      <strong>Number of opened forms {answers.data.length}</strong>

      <AnswerFilter setFilters={setFilters} filters={filters} />

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
            <TextQuestionGroup key={group.id} questionGroup={group} answers={answerData} />
          ))}
        </>
      ) : (
        <>
          {questionData.map(group => (
            <RadioQuestionGroup key={group.id} questionGroup={group} answers={answerData} />
          ))}
        </>
      )}
    </div>
  )
}
