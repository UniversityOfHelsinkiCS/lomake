import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateFormField } from '../../util/redux/formReducer'
import { colors } from '../../util/common'
import './Generic.scss'

const SimpleTextarea = ({ label, id, required, form }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const handleChange = ({ target }) => dispatch(updateFormField(target.id, target.value, form))
  const value = useSelector(({ form }) => form.data[fieldName] || '')
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  if (viewOnly && (!value || !value.trim().length)) return null // Dont render non-existing measures

  return (
    <div className="form-textarea">
      <label>
        {label}
        {required && <span style={{ color: colors.red, marginLeft: '0.2em' }}>*</span>}
      </label>
      {viewOnly ? value : <textarea id={fieldName} value={value} onChange={handleChange} />}
    </div>
  )
}

export default SimpleTextarea
