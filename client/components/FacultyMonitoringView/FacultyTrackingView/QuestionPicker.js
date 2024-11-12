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
  const answers = useSelector(({ form }) => form.data)
  const allSelectedQuestions = answers.selectedQuestionIds || []
  const [sectionQuestions, setSectionQuestions] = useState([])

  useEffect(() => {
    const questionsInSection = allSelectedQuestions.filter(id => questionsList.some(question => question.id === id))
    if (JSON.stringify(questionsInSection) !== JSON.stringify(sectionQuestions)) {
      setSectionQuestions(questionsInSection)
    }
  }, [allSelectedQuestions, questionsList, sectionQuestions])

  const updateAllSelectedQuestions = newQuestion => {
    const otherSectionQuestions = allSelectedQuestions.filter(id => !questionsList.some(question => question.id === id))
    const selectedQuestions = [...otherSectionQuestions, ...newQuestion].sort()
    dispatch(updateFormField(`${newQuestion[newQuestion.length - 1]}_degree_radio`, 'both', form))
    dispatch(updateFormField('selectedQuestionIds', selectedQuestions, form))
  }

  const handleSelectionChange = (_, { value: newQuestion }) => {
    setSectionQuestions(newQuestion)
    updateAllSelectedQuestions(newQuestion)
  }

  const isFilled = question => {
    const questionKeys = Object.keys(answers).filter(
      key => key.startsWith(`${question.id}_`) && !key.includes('degree_radio') && !key.includes('modal'),
    )
    if (questionKeys.some(key => answers[key] && answers[key].length > 0)) {
      return (
        <>
          <span>{`${question.index}. ${question.label[lang]}-`}</span>
          <span style={{ color: 'green' }}>{`(${t('common:filled')})`}</span>
        </>
      )
    }

    return <span>{`${question.index}. ${question.label[lang]}`}</span>
  }

  const dropdownOptions = questionsList.map(question => ({
    key: question.id,
    text: isFilled(question),
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
