/* eslint-disable no-restricted-syntax */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Divider } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { getReformAnswers } from 'Utilities/redux/reformAnswerReducer'
import { degreeReformIndividualQuestions as questionData } from '../../questionData'

const Question = ({ question, answers }) => {
  const lang = useSelector(state => state.language)

  const { t } = useTranslation()

  const { id, label } = question

  const trunc = s => s.substring(0, 12)

  const headerLables =
    question.radioOptions === 'numbers'
      ? [
          trunc(t('formView:stronglyDisagree')),
          trunc(t('formView:partiallyDisagree')),
          trunc(t('formView:neitherNor')),
          trunc(t('formView:partiallyAgree')),
          trunc(t('formView:stronglyAgree')),
          trunc(t('formView:doNotKnow')),
          trunc(t('formView:noAnswer')),
        ]
      : Object.values(question.radioOptions[lang])
          .map(v => v.label)
          .concat(trunc(t('formView:noAnswer')))

  const keys =
    question.radioOptions === 'numbers'
      ? ['first', 'second', 'third', 'fourth', 'fifth', 'idk', 'nop']
      : Object.values(question.radioOptions[lang])
          .map(v => v.id)
          .concat('nop')

  const values = keys.reduce((o, k) => {
    o[k] = 0
    return o
  }, {})

  for (const answer of answers) {
    const valOf = answer.data[id]
    if (valOf) {
      values[valOf] += 1
    } else {
      values.nop += 1
    }
  }

  return (
    <div style={{ marginTop: 20, marginLeft: 20 }}>
      <h4>{label[lang]}</h4>
      <Table celled>
        <Table.Header>
          <Table.Row>
            {headerLables.map(label => (
              <Table.HeaderCell key={label}>{label}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            {headerLables.map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Table.Cell key={i}>{values[keys[i]]}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  )
}

const QuestionGroup = ({ questionGroup, answers }) => {
  const lang = useSelector(state => state.language)
  const relevantParts = questionGroup.parts.filter(q => q.type === 'CHOOSE-RADIO')
  return (
    <div style={{ margin: 30, marginBottom: 10 }}>
      <h3 style={{ marginBotton: 10 }}>{questionGroup.title[lang]}</h3>
      {relevantParts.map(part => (
        <Question key={part.id} question={part} answers={answers} />
      ))}
      <div style={{ marginTop: 10 }} />
      <Divider />
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

  return (
    <div>
      <h1>Reform answers</h1>

      <strong>this many has answered {answers.data.length}</strong>

      {questionData.map(group => (
        <QuestionGroup key={group.id} questionGroup={group} answers={answers.data} />
      ))}
    </div>
  )
}
