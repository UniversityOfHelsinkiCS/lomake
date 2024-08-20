import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { updateFormField } from '../../util/redux/formReducer'
import './Generic.scss'
import { formKeys } from '../../../config/data'

const TrafficLights = ({ id, form }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const fieldName = `${id}_light`
  const choose = (name, id) => dispatch(updateFormField(name, id, form))
  const value = useSelector(({ form }) => form.data[fieldName])
  const finnishUniFormData = useSelector(({ form }) => form.finnishUniFormData.data)
  const reduxViewOnly = useSelector(({ form }) => form.viewOnly)

  const isUniFormLanguageVersion = window.location.href.match('((/UNI_EN)|(/UNI_SE))')
  const viewOnly = reduxViewOnly || isUniFormLanguageVersion

  const getClassName = color => {
    let tempValue = value
    if (form === formKeys.EVALUATION_COMMTTEES && finnishUniFormData) {
      tempValue = finnishUniFormData[fieldName]
    }
    if (tempValue === color) return `circle-big-${color}-selected${viewOnly ? '' : ' selected-animated'}`

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
