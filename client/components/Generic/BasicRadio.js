import React from 'react'
import { Radio, Form, Input } from 'semantic-ui-react'
import './Generic.scss'

const BasicRadio = ({ id, radioButtonLabels, direction, handleClick, viewOnly, type, checked, handleOtherField }) => {
  const handleChange = label => {
    if (type === 'basic') {
      handleClick(label)
    } else {
      handleClick({ firstPart: checked.firstValue, secondPart: label })
    }
  }

  const isChecked = value => {
    return type === 'basic' ? checked === value : checked.secondValue === value
  }
  return (
    <div>
      {radioButtonLabels ? (
        <div data-cy={`choose-radio-${id}`} style={direction === 'horizontal' ? { display: 'flex' } : null}>
          {radioButtonLabels.map(o => {
            return (
              <Form.Field
                key={`basic-radio-${id}-${o.id}`}
                style={
                  direction !== 'horizontal'
                    ? { display: 'flex', marginBottom: '0.2em' }
                    : { marginLeft: '2em', textAlign: 'center' }
                }
                disabled={viewOnly}
              >
                <Radio
                  name="basic-radio"
                  style={{ display: 'flex', alignItems: 'center' }}
                  value={o.label}
                  label={
                    <label
                      data-cy={`choose-radio-${o.id}`}
                      style={direction !== 'horizontal' ? { display: 'flex', marginLeft: '1.5em' } : null}
                    >
                      {o.label}
                    </label>
                  }
                  checked={isChecked(o.id)}
                  onClick={() => handleChange(o.id)}
                />
                {o.extraLabel ? <span style={{ marginLeft: '10em' }}>{o.extraLabel}</span> : null}
              </Form.Field>
            )
          })}
          {checked.secondValue === 'other' ? (
            <Form.Field>
              <Input
                disabled={viewOnly}
                style={{ width: '60%' }}
                value={checked.thirdValue}
                onChange={value => handleOtherField({ input: value, level: 2 })}
                version="degree-reform"
                size="small"
              />
            </Form.Field>
          ) : null}
        </div>
      ) : (
        <p>Missing options</p>
      )}
    </div>
  )
}

export default BasicRadio
