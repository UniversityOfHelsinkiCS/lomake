import React from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { Divider } from 'semantic-ui-react'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import { colors } from 'Utilities/common'
import { genericTranslations as translations } from 'Utilities/translations'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import Textarea from './Textarea'
import SmileyColors from './SmileyColors'
import './Generic.scss'

const mapColorToValid = {
  VIHREÄ: 'green',
  KELTAINEN: 'yellow',
  PUNAINEN: 'red',
}

const mapColorToImage = {
  green: positiveEmoji,
  yellow: neutralEmoji,
  red: negativeEmoji,
}

const Entity = ({ id, label, description, required, noColor, number, previousYearsAnswers, extrainfo }) => {
  const lang = useSelector(state => state.language)

  let previousAnswerColor = previousYearsAnswers ? previousYearsAnswers[`${id}_light`] : null
  if (['VIHREÄ', 'KELTAINEN', 'PUNAINEN'].indexOf(previousAnswerColor) !== -1) {
    previousAnswerColor = mapColorToValid[previousAnswerColor]
  }
  const previousAnswerText = previousYearsAnswers ? previousYearsAnswers[`${id}_text`] : null

  const EntityLastYearsAccordion = () => {
    if (!previousAnswerText && !previousAnswerColor) return null
    return (
      <LastYearsAnswersAccordion>
        {previousAnswerColor && (
          <img
            alt="previous-answer-color"
            style={{ width: '40px', height: 'auto' }}
            src={mapColorToImage[previousAnswerColor]}
          />
        )}
        <ReactMarkdown>{previousAnswerText}</ReactMarkdown>
      </LastYearsAnswersAccordion>
    )
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

      <Textarea id={id} label={translations.textAreaLabel[lang]} EntityLastYearsAccordion={EntityLastYearsAccordion} />
    </div>
  )
}

export default Entity
