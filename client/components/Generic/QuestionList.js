import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { setQuestions } from 'Utilities/redux/filterReducer'
import './Generic.scss'

const QuestionList = ({ label, questionsList, onlyColoredQuestions }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const questions = useSelector(({ filters }) => filters.questions)

  const getLabel = question => {
    if (!question) return ''
    const index = question.labelIndex < 10 ? `0${question.labelIndex}` : question.labelIndex
    return `${index}${question.label}`
  }

  const questionLabels = questionsList.map(q => getLabel(q))

  useEffect(() => {
    dispatch(setQuestions({ selected: questionLabels, open: [] }))
  }, [])

  const addToList = (_, { value }) => {
    dispatch(setQuestions({ selected: value, open: [] }))
  }

  const options = questionsList.map(q => {
    if (onlyColoredQuestions && !q.noColor) {
      return Object({ key: q.index, text: q.label, value: getLabel(q) })
    }
    if (!onlyColoredQuestions) {
      if (q.type === 'ENTITY' || q.type === 'MEASUREMENTS' || q.type === 'CHOOSE-RADIO') {
        return Object({ key: q.labelIndex, text: `${q.labelIndex}. ${q.label}`, value: getLabel(q) })
      }
      return Object({ key: `${q.labelIndex}. ${q.label}`, text: `${q.labelIndex}. ${q.label}`, value: getLabel(q) })
    }
    return undefined
  })

  return (
    <div className="questions-list-container" data-cy="comparison-question-list">
      <label className={`questions-list-label${questions.length === 0 ? '-bolded' : ''}`}>{label}</label>
      <Dropdown
        className="comparison-questions-list-selector"
        data-cy="questions-list"
        name="questions-list"
        fluid
        placeholder={label}
        options={options}
        onChange={addToList}
        value={questions.selected}
        multiple
        selection
      />
      <Button
        className="questions-list-button"
        color="blue"
        onClick={() => dispatch(setQuestions({ selected: questionLabels, open: [] }))}
        data-cy="questions-list-select-all"
      >
        {t('selectAll')}
      </Button>
      <Button
        onClick={() => dispatch(setQuestions({ selected: [], open: [] }))}
        className="comparison-questions-list-button"
      >
        {t('clearSelection')}
      </Button>
    </div>
  )
}

export default QuestionList
