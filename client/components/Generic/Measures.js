import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'

const measureLabel = {
  fi: 'TOIMENPIDELISTA (1-5 toimenpidettä)',
  en: 'MEASURES (1-5)',
  se: 'ÄTGÄRDER (1-5)'
}

const Measures = ({ label, id, required, number, langCode }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const handleChange = ({ target }) => dispatch(updateFormField(target.id, target.value))
  const value = useSelector(({ form }) => form.data[fieldName] || '')

  return (
    <>
      <h3>
        {number}. {label}
      </h3>
      <div className="form-textarea">
        <label>
          {number}. {measureLabel[langCode]}
          {required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
        </label>
        <textarea id={fieldName} value={value} onChange={handleChange} />
        <span style={{ color: value.length > 1000 ? 'red' : undefined }}>{value.length}/1000</span>
      </div>
    </>
  )
}

export default Measures
