import React from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { Divider } from 'semantic-ui-react'
import SmileyColors from './SmileyColors'
import Textarea from './Textarea'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import { colors } from 'Utilities/common'
import { genericTranslations as translations } from 'Utilities/translations'

const mapLightToValid = {
  VIHREÄ: 'green',
  KELTAINEN: 'yellow',
  PUNAINEN: 'red',
}

const mapLightToImage = {
  green: positiveEmoji,
  yellow: neutralEmoji,
  red: negativeEmoji,
}

const Entity = ({ id, label, description, required, noLight, number, previousYearsAnswers }) => {
  const lang = useSelector((state) => state.language)

  let previousAnswerLight = previousYearsAnswers ? previousYearsAnswers[`${id}_color`] : null
  if (['VIHREÄ', 'KELTAINEN', 'PUNAINEN'].indexOf(previousAnswerLight) !== -1) {
    previousAnswerLight = mapLightToValid[previousAnswerLight]
  }
  const previousAnswerText = previousYearsAnswers ? previousYearsAnswers[`${id}_text`] : null

  const EntityLastYearsAccordion = () => {
    if (!previousAnswerText && !previousAnswerLight) return null
    return (
      <LastYearsAnswersAccordion>
        {previousAnswerLight && (
          <img
            style={{ width: '40px', height: 'auto' }}
            src={mapLightToImage[previousAnswerLight]}
          />
        )}
        <ReactMarkdown source={previousAnswerText} />
      </LastYearsAnswersAccordion>
    )
  }

  return (
    <>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '400px' }}>
          <h3>
            {number}. {label}{' '}
            {required && <span style={{ color: colors.red, marginLeft: '0.2em' }}>*</span>}
          </h3>
        </div>
        {!noLight && <SmileyColors id={id} />}
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
      </p>

      <Textarea
        id={id}
        label={translations.textAreaLabel[lang]}
        EntityLastYearsAccordion={EntityLastYearsAccordion}
      />
    </>
  )
}

export default Entity
