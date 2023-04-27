import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { updateFormField } from 'Utilities/redux/formReducer'
import './Generic.scss'

const TrafficLights = ({ id, form }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
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
        <div title={`${t('positive')}`}>
          <div
            data-cy={`color-positive-${id}`}
            className={getClassName('green')}
            onClick={!viewOnly ? () => choose(fieldName, 'green') : undefined}
          />
        </div>
        <div title={`${t('neutral')}`}>
          <div
            data-cy={`color-neutral-${id}`}
            className={getClassName('yellow')}
            onClick={!viewOnly ? () => choose(fieldName, 'yellow') : undefined}
          />
        </div>
        <div title={`${t('negative')}`}>
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
