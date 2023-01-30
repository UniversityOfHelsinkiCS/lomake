import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Divider, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import { colors } from 'Utilities/common'
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

const Entity = ({
  id,
  label,
  description,
  required,
  noColor,
  number,
  previousYearsAnswers,
  extrainfo,
  katselmus = false,
  programme = null,
}) => {
  const { t } = useTranslation()

  let previousAnswerColor = previousYearsAnswers ? previousYearsAnswers[`${id}_light`] : null
  if (['VIHREÄ', 'KELTAINEN', 'PUNAINEN'].indexOf(previousAnswerColor) !== -1) {
    previousAnswerColor = mapColorToValid[previousAnswerColor]
  }
  const previousAnswerText = previousYearsAnswers ? previousYearsAnswers[`${id}_text`] : null

  const targetURL = `/katselmus/previous-years/${programme}`

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
      {katselmus && (
        <Link data-cy={`link-to-old-${id}-answers`} to={targetURL} target="_blank">
          Tarkastele kolmen edellisen vuoden vastauksia <Icon name="external" />
        </Link>
      )}
      <Textarea id={id} label={t('generic:textAreaLabel')} EntityLastYearsAccordion={EntityLastYearsAccordion} />
    </div>
  )
}

export default Entity
