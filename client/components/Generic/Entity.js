import React from 'react'
import Streetlights from './Streetlights'
import Textarea from './Textarea'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import { Divider } from 'semantic-ui-react'

const translations = {
  streetLightsLabel: {
    fi: 'Yleisarvio',
    en: 'General assessment',
    se: 'Allmänn bedömning',
  },
  textAreaLabel: {
    fi: 'Keskustelun pääkohdat olivat',
    en: 'Main points of discussion',
    se: 'Diskussionens huvudpunkter',
  },
}
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
  const languageCode = useSelector((state) => state.language)

  let previousAnswerLight = previousYearsAnswers ? previousYearsAnswers[`${id}_light`] : null
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
            {required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
          </h3>
        </div>
        {!noLight && <Streetlights id={id} />}
      </div>
      <p
        className="entity-description"
        style={{
          lineHeight: 2,
          backgroundColor: '#ffcd4c2e',
          padding: '1em',
          borderRadius: '5px',
          margin: '1em 0',
        }}
      >
        {description}
      </p>

      <Textarea
        id={id}
        label={translations.textAreaLabel[languageCode]}
        EntityLastYearsAccordion={EntityLastYearsAccordion}
      />
    </>
  )
}

export default Entity
