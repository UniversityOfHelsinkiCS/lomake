import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { getLabel } from 'Utilities/common'
import { setQuestions, getQuestions } from 'Utilities/redux/facultyMonitoringReducer'
import '../../Generic/Generic.scss'

const QuestionPicker = ({ faculty, label, questionsList }) => {
  const dispatch = useDispatch()

  const [selectedQuestions, setSelectedQuestions] = useState([])

  useEffect(() => {
    // setSelectedQuestions(dispatch(getQuestions(faculty, formKeys.FACULTY_MONITORING)))
  }, [])

  const options = questionsList
    .map(q => {
      return { key: `${q.id}`, text: `${q.labelIndex}. ${q.label}`, value: getLabel(q) }
    })
    .filter(Boolean) // Filter out any undefined options

  const addToList = (_, { value }) => {
    const selectedOptions = options.filter(option => value.includes(option.value))

    setSelectedQuestions(value)
    dispatch(setQuestions(selectedOptions))
  }

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
