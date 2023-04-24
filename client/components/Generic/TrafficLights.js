import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import './Generic.scss'

const TrafficLights = ({ id, form }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_light`
  const choose = (name, id) => dispatch(updateFormField(name, id, form))
  const value = useSelector(({ form }) => form.data[fieldName])
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const getClassName = color => {
    if (value === color) return `circle-big-${color}-selected${viewOnly ? '' : ' selected-animated'}`

    return `circle-big-${color}${viewOnly ? '' : ' unselected-animated'}`
  }

  return (
    <div style={{ margin: '1em 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
        <div title="No issues">
          <div
            data-cy={`color-positive-${id}`}
            className={getClassName('green')}
            onClick={!viewOnly ? () => choose(fieldName, 'green') : undefined}
          />
        </div>
        <div title="Challenges identified and development underway">
          <div
            data-cy={`color-neutral-${id}`}
            className={getClassName('yellow')}
            onClick={!viewOnly ? () => choose(fieldName, 'yellow') : undefined}
          />
        </div>
        <div title="Significant measures required/development areas not yet specified">
          <div
            data-cy={`color-negative-${id}`}
            className={getClassName('red')}
            onClick={!viewOnly ? () => choose(fieldName, 'red') : undefined}
          />
        </div>
      </div>
    </div>
  )
}

export default TrafficLights
