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

const InfoBox = ({
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

  return (
    <div className="form-entity-area">
      <Divider />
      <div
        className="entity-description"
        style={{
          lineHeight: 2,
          backgroundColor: colors.background_light_gray,
          padding: '1em',
          borderRadius: '5px',
          margin: '1em 0',
          fontSize: '16px',
        }}
      >
        {description}
        <p className="form-question-extrainfo">{extrainfo}</p>
        <br />
        {label}
      </div>
    </div>
  )
}

export default InfoBox
