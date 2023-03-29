import React, { useState, useEffect } from 'react'
import { Divider, Radio, Form } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
// import { updateFormField } from 'Utilities/redux/formReducer'

import { colors } from 'Utilities/common'
import './Generic.scss'

const mapColorToValid = {
  VIHREÄ: 'green',
  KELTAINEN: 'yellow',
  PUNAINEN: 'red',
}

const ChooseRadio = ({
  id,
  label,
  description,
  required,
  number,
  previousYearsAnswers,
  extrainfo,
  radioOptions,
  direction,
}) => {
  // const dispatch = useDispatch()
  const [state, setState] = useState({ value: '' })
  const dataFromRedux = useSelector(({ form }) => form.data[id] || '')
  const lang = useSelector(state => state.language)

  // temporary restriction
  // const choose = (name, id) => dispatch(updateFormField(name, id)) // TO FIX add form

  let previousAnswerColor = previousYearsAnswers ? previousYearsAnswers[`${id}_light`] : null
  if (['VIHREÄ', 'KELTAINEN', 'PUNAINEN'].indexOf(previousAnswerColor) !== -1) {
    previousAnswerColor = mapColorToValid[previousAnswerColor]
  }
  const generateKey = label => {
    return `${label}_${new Date().getTime()}`
  }
  const handleClick = label => {
    setState({ value: label })
    // choose(id, label)
  }

  useEffect(() => {
    setState({ value: dataFromRedux })
  }, [dataFromRedux])

  let radioButtonLabels

  if (typeof radioOptions === 'string') {
    let idkButton
    if (lang === 'fi') {
      idkButton = 'En osaa sanoa'
    } else if (lang === 'se') {
      idkButton = "I don't know"
    } else {
      idkButton = "I don't know"
    }
    radioButtonLabels = [
      { id: 'number-first', label: 1 },
      { id: 'number-second', label: 2 },
      { id: 'number-third', label: 3 },
      { id: 'number-fourth', label: 4 },
      { id: 'number-fifth', label: 5 },
      { id: 'text-idk', label: idkButton },
    ]
  } else {
    radioButtonLabels = radioOptions ? radioOptions[lang] : null
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
      </div>
      {description?.length > 1 ? (
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
      ) : (
        <div style={{ height: '1em' }} />
      )}
      {radioButtonLabels ? (
        <Form style={direction === 'horizontal' ? { display: 'flex' } : null}>
          {radioButtonLabels.map(o => {
            return (
              <Form.Field
                key={generateKey(o.label)}
                style={direction !== 'horizontal' ? { display: 'flex' } : { marginLeft: '2em', textAlign: 'center' }}
              >
                <Radio
                  name="radioGroup"
                  value={o.label}
                  checked={state.value === o.id}
                  onChange={() => handleClick(o.id)}
                />
                <label style={direction !== 'horizontal' ? { display: 'flex', marginLeft: '0.5em' } : null}>
                  {o.label}
                </label>
              </Form.Field>
            )
          })}
        </Form>
      ) : (
        <p>Missing options</p>
      )}
    </div>
  )
}

export default ChooseRadio
