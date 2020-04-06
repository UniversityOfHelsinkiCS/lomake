import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import './Streetlights.scss'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'

const Streetlights = ({ label, id, required }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_light`
  const choose = (name, id) => dispatch(updateFormField(name, id))
  const value = useSelector(({ form }) => form.data[fieldName])

  return (
    <div className="form-streetlights">
      <label>
        {label}
        {required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
        <div title="No issues">
          <img
            data-cy="street-light-positive"
            src={positiveEmoji}
            className={value === 'green' ? 'emoji emoji-button active-emoji' : 'emoji emoji-button'}
            onClick={() => choose(fieldName, 'green')}
          />
        </div>
        <div title="Challenges identified and development underway">
          <img
            data-cy="street-light-neutral"
            src={neutralEmoji}
            className={
              value === 'yellow' ? 'emoji emoji-button active-emoji' : 'emoji emoji-button'
            }
            onClick={() => choose(fieldName, 'yellow')}
          />
        </div>
        <div title="Significant measures required/development areas not yet specified">
          <img
            data-cy="street-light-negative"
            src={negativeEmoji}
            className={value === 'red' ? 'emoji emoji-button active-emoji' : 'emoji emoji-button'}
            onClick={() => choose(fieldName, 'red')}
          />
        </div>
      </div>
    </div>
  )
}

export default Streetlights
