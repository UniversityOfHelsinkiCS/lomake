import React, { useState, useEffect } from 'react'
import { Divider, Radio, Form } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'

import { colors, getForm } from 'Utilities/common'
import './Generic.scss'

const ChooseRadio = ({ id, label, description, required, extrainfo, radioOptions, direction, formType }) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({ value: '' })
  const dataFromRedux = useSelector(({ form }) => form.data[id] || '')
  const lang = useSelector(state => state.language)
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const form = getForm(formType)
  const choose = (field, value) => dispatch(updateFormField(field, value, form))

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
    <div className="form-choose-radio-area" data-cy={`choose-radio-container-${id}`}>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '750px' }}>
          <h3>
            {label} {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
          </h3>
        </div>
      </div>
      {description?.length > 1 ? (
        <div className="choose-radio-description">
          {description}
          <p className="form-question-extrainfo">{extrainfo}</p>
        </div>
      ) : (
        <div style={{ height: '1em' }} />
      )}
      {radioButtonLabels ? (
        <Form data-cy={`choose-radio-${id}`} style={direction === 'horizontal' ? { display: 'flex' } : null}>
          {radioButtonLabels.map(o => {
            return (
              <Form.Field
                key={generateKey(o.label)}
                style={direction !== 'horizontal' ? { display: 'flex' } : { marginLeft: '2em', textAlign: 'center' }}
              >
                <Radio
                  name="radioGroup"
                  value={o.label}
                  label={
                    <label
                      data-cy={`choose-radio-${o.id}`}
                      style={direction !== 'horizontal' ? { display: 'flex', marginLeft: '0.5em' } : null}
                    >
                      {o.label}
                    </label>
                  }
                  checked={state.value === o.id}
                  onChange={() => handleClick(o.id)}
                  disabled={viewOnly}
                />
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
