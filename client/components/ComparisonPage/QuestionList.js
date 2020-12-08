import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown } from 'semantic-ui-react'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import { setQuestions } from 'Utilities/redux/filterReducer'


const QuestionList = ({ label, questionsList }) => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)
  const questions = useSelector(({ filters }) => filters.questions)

  const getLabel = (question) => {
    if (!question) return ''
    const label = _.capitalize(question.label)
    const index = question.labelIndex < 10 ? `0${question.labelIndex}` : question.labelIndex
    return `${index}${label}`
  } 

  const questionLabels = questionsList.map((q) => getLabel(q))

  useEffect(() => {
    dispatch(setQuestions(questionLabels))
  }, [])


  const addToList = (_, { value }) => {
    dispatch(setQuestions(value))
  }

  const options = questionsList.map((q) => {
    if (!q.noColor) {
      return Object({ key: q.index, text: _.capitalize(q.label), value: getLabel(q) })
    }
  })

  return (
    <div className="questions-list-container" data-cy="comparison-question-list">
      <label className={`questions-list-label${questions.length === 0 ? '-bolded' : ''}`}>
        {label}
      </label>
      <Dropdown
        className="questions-list-selector"
        data-cy="questions-list"
        name="questions-list"
        fluid
        placeholder={translations.selectQuestions[lang]}
        options={options}
        onChange={addToList}
        value={questions}
        multiple
        selection
      />
      <Button
        className="questions-list-button"
        color="blue"
        onClick={() => dispatch(setQuestions(questionLabels))}
        data-cy="questions-list-select-all"
      >
        {translations.selectAll[lang]}
      </Button>
      <Button onClick={() => dispatch(setQuestions([]))} className="questions-list-button">
        {translations.clearSelection[lang]}
      </Button>
    </div>
  )
}

export default QuestionList
