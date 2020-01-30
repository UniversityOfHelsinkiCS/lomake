import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'

const Textarea = ({ label, id }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const handleChange = ({ target }) => dispatch(updateFormField(target.id, target.value))
  const value = useSelector(({ form }) => form.data[fieldName])

  return (
    <div className="form-textarea">
      <label>{label}</label>
      <textarea id={fieldName} value={value} onChange={handleChange}/>
    </div>
  )
}

export default Textarea
