/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Divider, Radio, Loader } from 'semantic-ui-react'
import { getReformAnswers } from '../../redux/reformAnswerReducer'
import { degreeReformIndividualQuestions as questionData } from '../../questionData'

import RadioQuestion from './RadioQuestion'
import BackroundUnitQuestion from './FacultyQuestion'
import TextQuestion from './TextQuestion'
import AnswerFilter from './AnswerFilter'

const RadioQuestionGroup = ({ questionGroup, answers }) => {
  const lang = useSelector(state => state.language)
  const relevantParts = questionGroup.parts.filter(q => q.type === 'CHOOSE-RADIO')

  const primaryRoleQuestion = questionGroup.parts.find(q => q.id === 'primary_role')
  const backroundUnitQuestion = questionGroup.parts.find(q => q.id === 'background_unit')

  return (
    <div style={{ margin: 30, marginBottom: 10 }}>
      <h3 style={{ marginBotton: 10 }}>{questionGroup.title[lang]}</h3>
      {relevantParts.map(part => (
        <RadioQuestion answers={answers} key={part.id} question={part} />
      ))}
      {primaryRoleQuestion ? <RadioQuestion answers={answers} question={primaryRoleQuestion} /> : null}
      {backroundUnitQuestion ? <BackroundUnitQuestion answers={answers} question={backroundUnitQuestion} /> : null}
      <div style={{ marginTop: 10 }} />
      <Divider />
    </div>
  )
}

export const TextQuestionGroup = ({ questionGroup, answers }) => {
  const lang = useSelector(state => state.language)
  const relevantParts = questionGroup.parts.filter(q => q.type === 'TEXTAREA')

  return (
    <div style={{ margin: 30, marginBottom: 10 }}>
      <h3 style={{ marginBotton: 10 }}>{questionGroup.title[lang]}</h3>
      {relevantParts.map(part => (
        <TextQuestion answers={answers} key={part.id} question={part} />
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
      if (!v) return v
      const splitPoint = v.indexOf('_-_')
      return splitPoint === -1 ? v : v.slice(0, splitPoint)
    }

    if (filters.length === 0) {
      return true
    }

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

      <AnswerFilter filters={filters} setFilters={setFilters} />

      <div style={{ marginTop: 30 }}>
        <div>
          <Radio
            checked={form === 'number'}
            label="Numerical answers"
            name="answerSelection"
            onChange={() => setForm('number')}
          />
        </div>
        <div>
          <Radio
            checked={form === 'textual'}
            label="Text answers"
            name="answerSelection"
            onChange={() => setForm('textual')}
          />
        </div>
      </div>

      {form === 'textual' ? (
        <>
          {questionData.slice(1).map(group => (
            <TextQuestionGroup answers={answerData} key={group.id} questionGroup={group} />
          ))}
        </>
      ) : (
        <>
          {questionData.map(group => (
            <RadioQuestionGroup answers={answerData} key={group.id} questionGroup={group} />
          ))}
        </>
      )}
    </div>
  )
}
