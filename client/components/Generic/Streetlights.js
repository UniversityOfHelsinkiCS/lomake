import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import { updateFormField } from 'Utilities/redux/formReducer'
import './Streetlights.scss'

const lightEmojiMap = {
  green: 'smile outline',
  yellow: 'meh outline',
  red: 'frown outline',
}

const Streetlights = ({ id }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_light`
  const choose = (name, id) => dispatch(updateFormField(name, id))
  const value = useSelector(({ form }) => form.data[fieldName])
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const getClassName = (color) => {
    if (value === color) return `emoji${viewOnly ? '' : ' emoji-button'} active-emoji`

    return `emoji${viewOnly ? '' : ' emoji-button'}`
  }

  if (viewOnly) {
    return (
      <>
        {value && (
          <div style={{ margin: '1em 0' }}>
            <Icon name={lightEmojiMap[value]} size="huge" />
          </div>
        )}
      </>
    )
  }

  return (
    <div style={{ margin: '1em 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
        <div title="No issues">
          <img
            data-cy={`street-light-positive-${id}`}
            src={positiveEmoji}
            className={getClassName('green')}
            onClick={!viewOnly ? () => choose(fieldName, 'green') : undefined}
          />
        </div>
        <div title="Challenges identified and development underway">
          <img
            data-cy={`street-light-neutral-${id}`}
            src={neutralEmoji}
            className={getClassName('yellow')}
            onClick={!viewOnly ? () => choose(fieldName, 'yellow') : undefined}
          />
        </div>
        <div title="Significant measures required/development areas not yet specified">
          <img
            data-cy={`street-light-negative-${id}`}
            src={negativeEmoji}
            className={getClassName('red')}
            onClick={!viewOnly ? () => choose(fieldName, 'red') : undefined}
          />
        </div>
      </div>
    </div>
  )
}

export default Streetlights
