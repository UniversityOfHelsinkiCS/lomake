import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { requiredFormIds } from 'Utilities/common'
import { updateFormField } from 'Utilities/redux/formReducer'
import './Streetlights.scss'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'

const Streetlights = ({ label, id }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_light`
  const choose = (name, id) => dispatch(updateFormField(name, id))
  const value = useSelector(({ form }) => form.data[fieldName])
  const required = requiredFormIds.indexOf(fieldName) !== -1

  return (
    <div className="form-streetlights">
      <label>
        {label}
        {required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
      </label>
      <div style={{ display: 'flex' }}>
        <div className={value === 'green' ? 'active-emoji' : 'invisible-border'} title="No issues">
          <img
            src={positiveEmoji}
            className={value === 'green' ? 'emoji emoji-button colored' : 'emoji emoji-button'}
            onClick={() => choose(fieldName, 'green')}
          />
        </div>
        <div
          className={value === 'yellow' ? 'active-emoji' : 'invisible-border'}
          title="Challenges identified and development underway"
        >
          <img
            src={neutralEmoji}
            className={value === 'yellow' ? 'emoji emoji-button colored' : 'emoji emoji-button'}
            onClick={() => choose(fieldName, 'yellow')}
          />
        </div>
        <div
          className={value === 'red' ? 'active-emoji' : 'invisible-border'}
          title="Significant measures required/development areas not yet specified"
        >
          <img
            src={negativeEmoji}
            className={value === 'red' ? 'emoji emoji-button colored' : 'emoji emoji-button'}
            onClick={() => choose(fieldName, 'red')}
          />
        </div>
      </div>
    </div>
  )
}

export default Streetlights
