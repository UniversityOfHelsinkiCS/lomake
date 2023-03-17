import React, { useState, useEffect } from 'react'
import { Divider, Radio, FormControl, RadioGroup } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'

import { colors } from 'Utilities/common'
import './Generic.scss'
import { FormControlLabel } from '@root/node_modules/@mui/material/index'

const mapColorToValid = {
  VIHREÄ: 'green',
  KELTAINEN: 'yellow',
  PUNAINEN: 'red',
}

const ChooseRadio = ({ id, label, description, required, number, previousYearsAnswers, extrainfo, radioOptions }) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({ value: '' })
  const dataFromRedux = useSelector(({ form }) => form.data[id] || '')
  const lang = useSelector(state => state.language)

  const choose = (name, id) => dispatch(updateFormField(name, id))

  let previousAnswerColor = previousYearsAnswers ? previousYearsAnswers[`${id}_light`] : null
  if (['VIHREÄ', 'KELTAINEN', 'PUNAINEN'].indexOf(previousAnswerColor) !== -1) {
    previousAnswerColor = mapColorToValid[previousAnswerColor]
  }
  const generateKey = label => {
    return `${label}_${new Date().getTime()}`
  }
  const handleClick = label => {
    setState({ value: label })
    choose(id, label)
  }

  useEffect(() => {
    setState({ value: dataFromRedux })
  }, [dataFromRedux])
  const radioButtonLabels = radioOptions ? radioOptions[lang] : null

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
      </div>
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
      {radioButtonLabels ? (
        <FormControl>
          {radioButtonLabels.map(o => {
            return (
              <RadioGroup key={generateKey(o.label)}>
                <FormControlLabel
                  label={o.label}
                  name="radioGroup"
                  value={o.label}
                  control={<Radio />}
                  checked={state.value === o.id}
                  onChange={() => handleClick(o.id)}
                />
              </RadioGroup>
            )
          })}
        </FormControl>
      ) : (
        <p>Missing options</p>
      )}
    </div>
  )
}

export default ChooseRadio
