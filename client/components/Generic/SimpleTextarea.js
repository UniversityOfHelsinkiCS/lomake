import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'

const SimpleTextarea = ({ label, id, required }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const handleChange = ({ target }) => dispatch(updateFormField(target.id, target.value))
  const value = useSelector(({ form }) => form.data[fieldName] || '')
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  return (
    <div className="form-textarea">
      <label>
        {label}
        {required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
      </label>
      {viewOnly ? <>{value}</> : <textarea id={fieldName} value={value} onChange={handleChange} />}
      {/* Is limited answers even needed for measures? */}
      {/*<span style={{ color: value.length > 500 ? 'red' : undefined }}>{value.length}/500</span>*/}
    </div>
  )
}

export default SimpleTextarea
