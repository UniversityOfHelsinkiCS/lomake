import React from 'react'
import { Radio, Form } from 'semantic-ui-react'
import './Generic.scss'

const BasicRadio = ({ id, radioButtonLabels, direction, handleClick, viewOnly, checked }) => {
  const generateKey = label => {
    return `${label}_${new Date().getTime()}`
  }

  let selectedFirstPart = ''
  let selectedSecondPart = ''

  const isThereALine = checked.length > 0 ? checked.indexOf('-') !== -1 : false
  if (isThereALine) {
    const indexOfLine = checked.length
    selectedFirstPart = checked.substring(0, indexOfLine)
  } else {
    const indexOfLine = checked.indexOf('-')
    selectedFirstPart = checked.substring(0, indexOfLine)
    selectedSecondPart = checked.substring(indexOfLine + 1, checked.length)
  }
  const handleChange = value => {
    handleClick({ firstPart: selectedFirstPart, value })
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
                  value={selectedSecondPart}
                  label={
                    <label
                      data-cy={`choose-radio-${o.id}`}
                      style={direction !== 'horizontal' ? { display: 'flex', marginLeft: '0.5em' } : null}
                    >
                      {o.label}
                    </label>
                  }
                  checked={selectedSecondPart === o.id}
                  onClick={() => handleChange(o.id)}
                  disabled={viewOnly}
                />
              </Form.Field>
            )
          })}
        </div>
      ) : (
        <p>Missing options</p>
      )}
    </div>
  )
}

export default BasicRadio
