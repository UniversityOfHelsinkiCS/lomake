import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'

const Textarea = ({ label, id, required }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const handleChange = ({ target }) => dispatch(updateFormField(target.id, target.value))
  const value = useSelector(({ form }) => form.data[fieldName] || '')

  return (
    <div className="form-textarea">
      <label>
        {label}
        {required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
      </label>
      <textarea id={fieldName} value={value} onChange={handleChange} />
      <span style={{ color: value.length > 1000 ? 'red' : undefined }}>{value.length}/1000</span>
    </div>
  )
}

export default Textarea
