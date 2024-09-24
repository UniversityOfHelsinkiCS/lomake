import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Menu, Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { updateFormField } from 'Utilities/redux/formReducer'
import './Generic.scss'

const TrackingTrafficLight = ({ id, form }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const fieldName = `${id}_lights_history`
  const lightsHistory = useSelector(({ form }) => form.data[fieldName]) || []
  const displayedHistory = lightsHistory.slice(Math.max(lightsHistory.length - 4, 0))
  const reduxViewOnly = useSelector(({ form }) => form.viewOnly)
  const value = useSelector(({ form }) => form.data[fieldName])

  const [showChooser, setShowChooser] = useState(false)

  const colorValueMap = {
    green: 1,
    yellow: 0,
    red: -1,
  }

  const chooseLight = color => {
    if (!reduxViewOnly) {
      const value = colorValueMap[color] !== undefined ? colorValueMap[color] : null
      const newEntry = { color, value, date: new Date().toISOString() }
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

  const removeLight = index => {
    if (!reduxViewOnly) {
      const updatedHistory = lightsHistory.filter((_, i) => i !== index)
      dispatch(updateFormField(fieldName, updatedHistory, form))
    }
  }

  return (
    <>
      <Header as="h5">{t('tracking')}</Header>
      <Menu secondary style={{ display: 'flex', flexWrap: 'wrap' }}>
        {displayedHistory.length ? (
          displayedHistory.map((entry, index) => (
            <Menu.Item>
              <span className={`answer-circle-big-${entry.color}`} />
              <i>
                {new Date(entry.date)
                  .toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  .split('/')
                  .join('.')}
              </i>
              <Button
                icon="trash"
                size="mini"
                onClick={() => removeLight(index)}
                disabled={reduxViewOnly}
                style={{ marginLeft: '0.5em' }} // Add some spacing
              />
            </Menu.Item>
          ))
        ) : (
          <i style={{ color: 'gray', marginLeft: '4px' }}>{t('noTrafficLight')}</i>
        )}
        <Menu.Item position="right">
          <Button onClick={toggleChooser} disabled={reduxViewOnly}>
            {t('chooseTrafficLight')}
          </Button>
        </Menu.Item>
      </Menu>

      {showChooser && (
        <>
          <b>{t('chooseTrafficLight')}</b>
          <div style={{ margin: '1em 0' }}>
            <div style={{ alignItems: 'center' }}>
              <div title={t('greenFaculty')} style={{ display: 'flex' }}>
                <div
                  data-cy={`color-positive-${id}`}
                  className={getClassName('green')}
                  onClick={!reduxViewOnly ? () => chooseLight('green') : undefined}
                />
                <p style={{ margin: '1em' }}>{t('greenFaculty')}</p>
              </div>
              <div title={t('yellowFaculty')} style={{ display: 'flex' }}>
                <div
                  data-cy={`color-neutral-${id}`}
                  className={getClassName('yellow')}
                  onClick={!reduxViewOnly ? () => chooseLight('yellow') : undefined}
                />
                <p style={{ margin: '1em' }}>{t('yellowFaculty')}</p>
              </div>
              <div title={t('redFaculty')} style={{ display: 'flex' }}>
                <div
                  data-cy={`color-negative-${id}`}
                  className={getClassName('red')}
                  onClick={!reduxViewOnly ? () => chooseLight('red') : undefined}
                />
                <p style={{ margin: '1em' }}>{t('redFaculty')}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default TrackingTrafficLight
