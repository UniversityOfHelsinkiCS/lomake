import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { getLabel } from 'Utilities/common'
import { setQuestions, getQuestions } from 'Utilities/redux/facultyMonitoringReducer'
import { updateFormField } from 'Utilities/redux/formReducer' // Assuming you have this action creator
import '../../Generic/Generic.scss'

const QuestionPicker = ({ faculty, label, questionsList, form }) => {
  const dispatch = useDispatch()

  const fieldName = `${faculty}_selectedQuestionIds`
  const selectedQuestions = useSelector(({ form }) => form.data[fieldName] || [])
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const handleChange = ({ id, value }) => dispatch(updateFormField(id, value, form))

  const options = questionsList
    .map(q => {
      return { key: `${q.id}`, text: `${q.labelIndex}. ${q.label}`, value: q.id }
    })
    .filter(Boolean) // Filter out any undefined options

  const addToList = (_, { value }) => {
    const selectedOptions = options.filter(option => value.includes(option.value))

    dispatch(setQuestions(selectedOptions))

    // Call handleChange with the faculty and selected question IDs
    handleChange({ id: fieldName, value })
  }

  if (viewOnly && (!selectedQuestions || selectedQuestions.length === 0)) return null // Don't render if viewOnly and no selected questions

  return (
    <div className="questions-list-container" data-cy="question-picker">
      <label className={`questions-list-label${selectedQuestions.length === 0 ? '-bolded' : ''}`}>{label}</label>
      <Dropdown
        className="comparison-questions-list-selector"
        data-cy="questions-list"
        name="questions-list"
        fluid
        placeholder={label}
        options={options}
        onChange={addToList}
        value={selectedQuestions}
        multiple
        selection
      />
    </div>
  )
}

export default QuestionPicker
