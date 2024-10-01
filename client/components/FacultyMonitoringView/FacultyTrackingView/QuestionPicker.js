import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { updateFormField } from 'Utilities/redux/formReducer'
import '../../Generic/Generic.scss'

const QuestionPicker = ({ index, label, questionsList, form }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const allSelectedQuestions = useSelector(({ form }) => form.data.selectedQuestionIds || [])
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

  return (
    <div className="questions-list-container" data-cy="question-picker">
      <label className="questions-list-label">{label}</label>
      <Dropdown
        className="comparison-questions-list-selector"
        data-cy={`questions-list-${index}`}
        name="questions-list"
        fluid
        placeholder={t('common:noSelections')}
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
