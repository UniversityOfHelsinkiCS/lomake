import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'

const Streetlights = ({ label, id }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_light`
  const choose = ({ target }) => dispatch(updateFormField(target.name, target.id))
  const value = useSelector(({ form }) => form.data[fieldName])

  return (
    <div className="form-streetlights">
      <label>{label}</label>
      <div>
        <div>
          <input id="green" name={fieldName} type="radio" checked={value === "green"} onChange={choose} />
          <label>GREEN</label>
        </div>
        <div>
          <input id="yellow" name={fieldName} type="radio" checked={value === "yellow"} onChange={choose} />
          <label>YELLOW</label>
        </div>
        <div>
          <input id="red" name={fieldName} type="radio" checked={value === "red"} onChange={choose} />
          <label>RED</label>
        </div>
      </div>
    </div>
  )
}

export default Streetlights
