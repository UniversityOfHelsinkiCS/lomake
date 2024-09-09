import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { updateFormField } from 'Utilities/redux/formReducer'
import './Generic.scss'

const TrackingTrafficLight = ({ id, form }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const fieldName = `${id}_lights_history`
  const lightsHistory = useSelector(({ form }) => form.data[fieldName]) || []
  const reduxViewOnly = useSelector(({ form }) => form.viewOnly)
  const value = useSelector(({ form }) => form.data[fieldName])

  const [showChooser, setShowChooser] = useState(false)

  const chooseLight = color => {
    if (!reduxViewOnly) {
      const newEntry = { color, date: new Date().toISOString() }
      dispatch(updateFormField(fieldName, [...lightsHistory, newEntry], form))
      setShowChooser(false)
    }
  }

  const toggleChooser = () => {
    setShowChooser(prev => !prev)
  }

  const getClassName = color => {
    const tempValue = value
    if (tempValue === color) return `circle-big-${color}-selected${reduxViewOnly ? '' : ' selected-animated'}`

    return `circle-big-${color}${reduxViewOnly ? '' : ' unselected-animated'}`
  }

  return (
    <div style={{ margin: '1em 0' }}>
      <div>
        <h4>{t('tracking')}</h4>
        {lightsHistory.map(entry => (
          <span className={`answer-circle-${entry.color}`} />
        ))}
      </div>
      <Button onClick={toggleChooser} disabled={reduxViewOnly}>
        {t('chooseTrafficLight')}
      </Button>

      {showChooser && (
        <div style={{ margin: '1em 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
            <div title={`${t('positive')}`}>
              <div
                data-cy={`color-positive-${id}`}
                className={getClassName('green')}
                onClick={!reduxViewOnly ? () => chooseLight('green') : undefined}
              />
            </div>
            <div title={`${t('neutral')}`}>
              <div
                data-cy={`color-neutral-${id}`}
                className={getClassName('yellow')}
                onClick={!reduxViewOnly ? () => chooseLight('yellow') : undefined}
              />
            </div>
            <div title={`${t('negative')}`}>
              <div
                data-cy={`color-negative-${id}`}
                className={getClassName('red')}
                onClick={!reduxViewOnly ? () => chooseLight('red') : undefined}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackingTrafficLight
