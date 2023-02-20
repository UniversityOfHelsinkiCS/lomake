import React, { useState } from 'react'
import { Divider } from 'semantic-ui-react'
import { colors } from 'Utilities/common'
import SmileyColors from './SmileyColors'
import './Generic.scss'
import './Slider.scss'

const mapColorToValid = {
  VIHREÄ: 'green',
  KELTAINEN: 'yellow',
  PUNAINEN: 'red',
}

const Slider = ({ id, label, description, required, noColor, number, previousYearsAnswers, extrainfo }) => {
  const [state, setState] = useState(3)

  let previousAnswerColor = previousYearsAnswers ? previousYearsAnswers[`${id}_light`] : null
  if (['VIHREÄ', 'KELTAINEN', 'PUNAINEN'].indexOf(previousAnswerColor) !== -1) {
    previousAnswerColor = mapColorToValid[previousAnswerColor]
  }

  const handleSlider = (event, value) => {
    // const x = document.getElementById(`slider-input-${id}`).value

    setState(value)
  }

  return (
    <div className="form-entity-area">
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '500px' }}>
          <h3>
            {number}. {label}{' '}
            {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
          </h3>
        </div>
        {!noColor && <SmileyColors id={id} />}
      </div>
      {description !== null && description?.length > 0 ? (
        <div
          className="entity-description"
          style={{
            lineHeight: 2,
            backgroundColor: colors.background_beige,
            padding: '1em',
            borderRadius: '5px',
            margin: '1em 0',
          }}
        >
          {description}
          <p className="form-question-extrainfo">{extrainfo}</p>
        </div>
      ) : null}
      <div className="slider-container">
        <input
          className="slider"
          list="amazing"
          id={`slider-input-${id}`}
          step="1"
          type="range"
          min="1"
          max="5"
          value={state}
          onChange={handleSlider}
        />
        <datalist className="datalist" id="amazing">
          <option value={1}>Erittäin huonosti</option>
          <option value={2}>Osittain huonosti</option>
          <option value={3}>En tiedä</option>
          <option value={4}>Osittain hyvin </option>
          <option value={5}>Erittäin hyvin</option>
        </datalist>
      </div>
    </div>
  )
}

export default Slider
