import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { updateFormField } from 'Utilities/redux/formReducer'
import '../../Generic/Generic.scss'

const QuestionPicker = ({ label, questionsList, form }) => {
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const allSelectedQuestions = useSelector(({ form }) => form.data.selectedQuestionIds)
  const [sectionQuestions, setSectionQuestions] = useState([])

  useEffect(() => {
    const questionsInSection = allSelectedQuestions.filter(id => questionsList.some(question => question.id === id))
    if (JSON.stringify(questionsInSection) !== JSON.stringify(sectionQuestions)) {
      setSectionQuestions(questionsInSection)
    }
  }, [allSelectedQuestions, questionsList, sectionQuestions])

  const updateAllSelectedQuestions = newQuestion => {
    const otherSectionQuestions = allSelectedQuestions.filter(id => !questionsList.some(question => question.id === id))
    const selectedQuestions = [...otherSectionQuestions, ...newQuestion]
    dispatch(updateFormField('selectedQuestionIds', selectedQuestions, form))
  }

  const handleSelectionChange = (_, { value: newQuestion }) => {
    setSectionQuestions(newQuestion)
    updateAllSelectedQuestions(newQuestion)
  }

  const dropdownOptions = questionsList.map(question => ({
    key: question.id,
    text: `${question.index}. ${question.label[lang]}`,
    value: question.id,
  }))

  if (viewOnly && sectionQuestions.length === 0) return null

  return (
    <div className="questions-list-container" data-cy="question-picker">
      <label className={`questions-list-label${sectionQuestions.length === 0 ? '-bolded' : ''}`}>{label}</label>
      <Dropdown
        className="comparison-questions-list-selector"
        data-cy="questions-list"
        name="questions-list"
        fluid
        placeholder={label}
        options={dropdownOptions}
        onChange={handleSelectionChange}
        value={sectionQuestions}
        multiple
        selection
      />
    </div>
  )
}

export default QuestionPicker
