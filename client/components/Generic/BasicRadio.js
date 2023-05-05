import React from 'react'
import { Radio, Form, Input } from 'semantic-ui-react'
import './Generic.scss'

const BasicRadio = ({ id, radioButtonLabels, direction, handleClick, viewOnly, type, checked, handleOtherField }) => {
  const generateKey = label => {
    return `${label}_${new Date().getTime()}`
  }
  const handleChange = label => {
    if (type === 'basic') {
      handleClick(label)
    } else {
      handleClick({ firstPart: checked.firstValue, secondPart: label })
    }
  }

  const isChecked = value => {
    return type === 'basic' ? checked.firstValue === value : checked.secondValue === value
  }

  return (
    <div>
      {radioButtonLabels ? (
        <div data-cy={`choose-radio-${id}`} style={direction === 'horizontal' ? { display: 'flex' } : null}>
          {radioButtonLabels.map(o => {
            return (
              <Form.Field
                key={generateKey(o.label)}
                style={direction !== 'horizontal' ? { display: 'flex' } : { marginLeft: '2em', textAlign: 'center' }}
              >
                <Radio
                  name="basic-radio"
                  value={o.label}
                  label={
                    <label
                      data-cy={`choose-radio-${o.id}`}
                      style={direction !== 'horizontal' ? { display: 'flex', marginLeft: '0.5em' } : null}
                    >
                      {o.label}
                    </label>
                  }
                  checked={isChecked(o.id)}
                  onClick={() => handleChange(o.id)}
                  disabled={viewOnly}
                />
              </Form.Field>
            )
          })}
          {checked.secondValue === 'other' ? (
            <Input
              key={generateKey('random')}
              style={{ width: '60%' }}
              value={checked.thirdValue}
              onChange={handleOtherField}
              version="degree-reform"
              size="small"
              autoFocus
            />
          ) : null}
        </div>
      ) : (
        <p>Missing options</p>
      )}
    </div>
  )
}

export default BasicRadio
