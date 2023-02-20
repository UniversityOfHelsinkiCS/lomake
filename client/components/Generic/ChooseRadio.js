import React, { useState } from 'react'
import { Divider, Radio, Form } from 'semantic-ui-react'

import { colors } from 'Utilities/common'
import './Generic.scss'

const mapColorToValid = {
  VIHREÄ: 'green',
  KELTAINEN: 'yellow',
  PUNAINEN: 'red',
}

const ChooseRadio = ({ id, label, description, required, number, previousYearsAnswers, extrainfo, radioOptions }) => {
  const [state, setState] = useState({ value: '' })

  let previousAnswerColor = previousYearsAnswers ? previousYearsAnswers[`${id}_light`] : null
  if (['VIHREÄ', 'KELTAINEN', 'PUNAINEN'].indexOf(previousAnswerColor) !== -1) {
    previousAnswerColor = mapColorToValid[previousAnswerColor]
  }

  const generateKey = label => {
    return `${label}_${new Date().getTime()}`
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
      {radioOptions ? (
        <Form>
          {radioOptions.map(o => {
            return (
              <Form.Field key={generateKey(o.label)}>
                <Radio
                  label={o.label}
                  name="radioGroup"
                  value={o.label}
                  checked={state.value === o.label}
                  onChange={() => setState({ value: o.label })}
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
