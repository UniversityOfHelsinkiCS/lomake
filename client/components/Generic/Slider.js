import React, { useState } from 'react'
import { Divider, Radio, Popover, Icon } from '@mui/material'
import { colors } from 'Utilities/common'
import './Generic.scss'
import './Slider.scss'

const mapColorToValid = {
  VIHREÄ: 'green',
  KELTAINEN: 'yellow',
  PUNAINEN: 'red',
}

const Slider = ({ id, label, description, required, number, previousYearsAnswers, extrainfo }) => {
  const [state, setState] = useState(3)
  const [sliderClicked, setSliderCLicked] = useState(false)

  let previousAnswerColor = previousYearsAnswers ? previousYearsAnswers[`${id}_light`] : null
  if (['VIHREÄ', 'KELTAINEN', 'PUNAINEN'].indexOf(previousAnswerColor) !== -1) {
    previousAnswerColor = mapColorToValid[previousAnswerColor]
  }

  const handleSlider = () => {
    const x = document.getElementById(`slider-input-${id}`).value
    setState(x)
  }

  return (
    <div className="form-entity-area">
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '500px' }}>
          <h3>
            {number}. {label}{' '}
            {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
            <Popover
              content={
                <>
                  <p>1 = Täyin eri mieltä</p>
                  <p>2 = Osittain eri mieltä§</p>
                  <p>3 = Ei samaa eikä eri mieltä</p>
                  <p>4 = Osittain samaa mieltä§</p>
                  <p>5 = Täysin samaa mieltä</p>
                </>
              }
              popper={{ id: 'popper-container', style: { zIndex: 2000 } }}
              trigger={<Icon style={{ marginLeft: '0.5em' }} name="question circle outline" />}
            />
          </h3>
        </div>
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
        <div className="slider-and-button-container">
          <input
            className="slider"
            list="slider-values"
            style={{ backgroundColor: sliderClicked ? 'grey' : null }}
            id={`slider-input-${id}`}
            step="1"
            type="range"
            min="1"
            max="5"
            disabled={sliderClicked}
            value={state}
            onChange={handleSlider}
          />
          <Radio
            className="slider-button"
            toggle
            onClick={() => setSliderCLicked(!sliderClicked)}
            label="En tiedä"
            style={{ display: 'block' }}
          />
        </div>
        {/* <datalist className="datalist" id="slider-values">
          <option value="1">Erittäin huonosti</option>
          <option value="2">Osittain huonosti</option>
          <option value="3">Ei hyvin eikä huonosti</option>
          <option value="4">Osittain hyvin </option>
          <option value="5">Erittäin hyvin</option>
        </datalist> */}
        <datalist className="datalist" id="slider-values">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4 </option>
          <option value="5">5</option>
        </datalist>
      </div>
    </div>
  )
}

export default Slider
