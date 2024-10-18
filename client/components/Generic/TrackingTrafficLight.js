import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Menu, Header, Grid } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { updateFormField } from 'Utilities/redux/formReducer'
import DatePicker, { registerLocale } from 'react-datepicker'
import { fi, enGB, sv } from 'date-fns/locale'
import './Generic.scss'

const TrackingTrafficLight = ({ id, form }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const fieldName = `${id}_lights_history`
  const lightsHistory = useSelector(({ form }) => form.data[fieldName]) || []
  const displayedHistory = lightsHistory.slice(Math.max(lightsHistory.length - 4, 0))
  const reduxViewOnly = useSelector(({ form }) => form.viewOnly)
  const value = useSelector(({ form }) => form.data[fieldName])

  const [showChooser, setShowChooser] = useState(false)
  const [customDate, setCustomDate] = useState(new Date().toISOString())

  registerLocale('fi', fi)
  registerLocale('en', enGB)
  registerLocale('se', sv)

  const colorValueMap = {
    green: 1,
    yellow: 0,
    red: -1,
  }

  const chooseLight = color => {
    if (!reduxViewOnly) {
      const value = colorValueMap[color] !== undefined ? colorValueMap[color] : null
      const newEntry = { color, value, date: customDate }

      // Insert the new entry in chronological order
      const updatedHistory = [...lightsHistory, newEntry].sort((a, b) => new Date(a.date) - new Date(b.date))

      dispatch(updateFormField(fieldName, updatedHistory, form))
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
      // eslint-disable-next-line no-alert
      const confirmRemoval = window.confirm(t('confirmRemoveLight')) // Add confirmation prompt
      if (confirmRemoval) {
        const updatedHistory = lightsHistory.filter((_, i) => i !== index)
        dispatch(updateFormField(fieldName, updatedHistory, form))
      }
    }
  }

  return (
    <>
      <Header as="h5">{t('tracking')}</Header>
      <Menu secondary style={{ display: 'flex', flexWrap: 'wrap' }}>
        {displayedHistory.length ? (
          displayedHistory.map((entry, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Menu.Item key={`${entry.date}-${index}`}>
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
          <i style={{ color: 'gray', marginLeft: '4px', marginTop: '8px' }}>{t('noTrafficLight')}</i>
        )}
        <Menu.Item position="right">
          {!showChooser && (
            <Button data-cy="toggle-chooser" onClick={toggleChooser} disabled={reduxViewOnly}>
              {t('chooseTrafficLight')}
            </Button>
          )}
        </Menu.Item>
      </Menu>

      {showChooser && (
        <Grid columns={4} style={{ margin: '1em 0' }}>
          <b>{t('chooseTrafficLight')}</b>
          <Grid.Row>
            <Grid.Column data-cy="date-picker">
              <DatePicker
                dateFormat="dd.MM.yyyy"
                onChange={setCustomDate}
                selected={customDate}
                disabled={!form}
                locale={lang}
                showYearDropdown
                showMonthDropdown
                fixedHeight
              />
            </Grid.Column>
            <Grid.Column>
              <div title={t('facultyTracking:green')} style={{ display: 'flex' }}>
                <div
                  data-cy={`color-positive-${id}`}
                  className={getClassName('green')}
                  onClick={!reduxViewOnly ? () => chooseLight('green') : undefined}
                />
                <p style={{ margin: '1em' }}>{t('facultyTracking:green')}</p>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div title={t('facultyTracking:yellow')} style={{ display: 'flex' }}>
                <div
                  data-cy={`color-neutral-${id}`}
                  className={getClassName('yellow')}
                  onClick={!reduxViewOnly ? () => chooseLight('yellow') : undefined}
                />
                <p style={{ margin: '1em' }}>{t('facultyTracking:yellow')}</p>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div title={t('facultyTracking:red')} style={{ display: 'flex' }}>
                <div
                  data-cy={`color-negative-${id}`}
                  className={getClassName('red')}
                  onClick={!reduxViewOnly ? () => chooseLight('red') : undefined}
                />
                <p style={{ margin: '1em' }}>{t('facultyTracking:red')}</p>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </>
  )
}

export default TrackingTrafficLight
