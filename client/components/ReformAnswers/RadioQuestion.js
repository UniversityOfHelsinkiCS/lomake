/* eslint-disable no-restricted-syntax */
import React from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { degreeReformBackgroundColor } from 'Utilities/common'

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
          trunc(t('formView:average')),
        ]
      : Object.values(question.radioOptions[lang])
          .map(v => v.label)
          .concat(trunc(t('formView:noAnswer')))

  const optionLabels = ['first', 'second', 'third', 'fourth', 'fifth']

  const keys =
    question.radioOptions === 'numbers'
      ? optionLabels.concat(['idk', 'nop', 'average'])
      : Object.values(question.radioOptions[lang])
          .map(v => v.id)
          .concat('nop')

  const values = keys.reduce((o, k) => {
    o[k] = 0
    return o
  }, {})

  const getValue = answer => {
    const theAnswer = answer.data[id]
    if (question.type !== 'CHOOSE-ADVANCED') {
      return theAnswer
    }

    const stop = theAnswer.indexOf('_-_')
    if (stop === -1) {
      return theAnswer
    }

    return theAnswer.slice(0, stop)
  }

  for (const answer of answers) {
    const valOf = getValue(answer)

    if (valOf) {
      values[valOf] += 1
    } else {
      values.nop += 1
    }
  }

  const answersCount = optionLabels.reduce((sum, i) => {
    return values[i] + sum
  }, 0)

  const weightedSum = optionLabels.reduce((sum, i) => {
    const weigth = optionLabels.indexOf(i) + 1
    return weigth * values[i] + sum
  }, 0)

  let median = null
  for (const label of optionLabels) {
    if (!median || values[median] < values[label]) {
      median = label
    }
  }
  const medianIndex = optionLabels.indexOf(median)

  values.average = answersCount === 0 ? 0 : (weightedSum / answersCount).toFixed(1)

  const cellColor = (i, value, question) => {
    if (question.radioOptions !== 'numbers') {
      return {}
    }
    if (i === 7) {
      return { backgroundColor: degreeReformBackgroundColor(value) }
    }

    if (i === medianIndex) {
      return { backgroundColor: 'lightGrey' }
    }
    return {}
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
              <Table.Cell key={i} style={cellColor(i, values[keys[i]], question)}>
                {values[keys[i]]}
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  )
}

export default Question
