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
    <div style={{ margin: '1em 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
        <div title="No issues">
          <img
            data-cy={`street-light-positive-${id}`}
            src={positiveEmoji}
            className={value === 'green' ? 'emoji emoji-button active-emoji' : 'emoji emoji-button'}
            onClick={() => choose(fieldName, 'green')}
          />
        </div>
        <div title="Challenges identified and development underway">
          <img
            data-cy={`street-light-neutral-${id}`}
            src={neutralEmoji}
            className={
              value === 'yellow' ? 'emoji emoji-button active-emoji' : 'emoji emoji-button'
            }
            onClick={() => choose(fieldName, 'yellow')}
          />
        </div>
        <div title="Significant measures required/development areas not yet specified">
          <img
            data-cy={`street-light-negative-${id}`}
            src={negativeEmoji}
            className={value === 'red' ? 'emoji emoji-button active-emoji' : 'emoji emoji-button'}
            onClick={() => choose(fieldName, 'red')}
          />
        </div>
        {required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
      </div>
    </div>
  )
}

export default Streetlights
