import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Divider, Radio, Form } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import { colors } from 'Utilities/common'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import SmileyColors from './SmileyColors'
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
  noColor,
  number,
  previousYearsAnswers,
  extrainfo,
  radioOptions,
}) => {
  const { t } = useTranslation()
  const [state, setState] = useState({ value: '' })

  let previousAnswerColor = previousYearsAnswers ? previousYearsAnswers[`${id}_light`] : null
  if (['VIHREÄ', 'KELTAINEN', 'PUNAINEN'].indexOf(previousAnswerColor) !== -1) {
    previousAnswerColor = mapColorToValid[previousAnswerColor]
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
      <p
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
      </p>
      <Form>
        {radioOptions.map(o => {
          return (
            <Form.Field>
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
    </div>
  )
}

export default ChooseRadio
