import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'

const Streetlights = ({ label, id }) => {
  const dispatch = useDispatch()
  const choose = ({ target }) => dispatch(updateFormField(id, target.id))

  return (
    <div className="form-streetlights">
      <label>{label}</label>
      <div>
        <div>
          <input id="green" name={`${id}_light`} type="radio" onClick={choose} />
          <label>GREEN</label>
        </div>
        <div>
          <input id="yellow" name={`${id}_light`} type="radio" onClick={choose} />
          <label>YELLOW</label>
        </div>
        <div>
          <input id="red" name={`${id}_light`} type="radio" onClick={choose} />
          <label>RED</label>
        </div>
      </div>
    </div>
  )
}

export default Streetlights
