import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'

const Textarea = ({ label, id }) => {
  const dispatch = useDispatch()
  const handleChange = ({ target }) => dispatch(updateFormField(target.id, target.value))

  return (
    <div className="form-textarea">
      <label>{label}</label>
      <textarea id={`${id}_text`} onChange={handleChange}/>
    </div>
  )
}

export default Textarea
