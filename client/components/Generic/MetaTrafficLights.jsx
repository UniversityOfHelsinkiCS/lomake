import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { updateFormField } from '../../util/redux/formReducer'
import './Generic.scss'

const MetaTrafficLights = ({ id, form }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const fieldName = `${id}_light`
  const choose = (name, id) => dispatch(updateFormField(name, id, form))
  const value = useSelector(({ form }) => form.data[fieldName])
  const reduxViewOnly = useSelector(({ form }) => form.viewOnly)

  const viewOnly = reduxViewOnly

  const getClassName = color => {
    const tempValue = value
    if (tempValue === color) return `circle-big-${color}-selected${viewOnly ? '' : ' selected-animated'}`

    return `circle-big-${color}${viewOnly ? '' : ' unselected-animated'}`
  }

  return (
    <div style={{ margin: '1em 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
        <div title={`${t('urgent')}`}>
          <div
            data-cy={`color-negative-${id}`}
            className={getClassName('red')}
            onClick={!viewOnly ? () => choose(fieldName, 'red') : undefined}
          />
        </div>
        <div title={`${t('semiUrgent')}`}>
          <div
            data-cy={`color-neutral-${id}`}
            className={getClassName('yellow')}
            onClick={!viewOnly ? () => choose(fieldName, 'yellow') : undefined}
          />
        </div>
        <div title={`${t('nonUrgent')}`}>
          <div
            data-cy={`color-positive-${id}`}
            className={getClassName('green')}
            onClick={!viewOnly ? () => choose(fieldName, 'green') : undefined}
          />
        </div>
        <div title={`${t('irrelevant')}`}>
          <div
            data-cy={`color-irrelevant-${id}`}
            className={getClassName('gray')}
            onClick={!viewOnly ? () => choose(fieldName, 'gray') : undefined}
          />
        </div>
      </div>
    </div>
  )
}

export default MetaTrafficLights
