import React from 'react'
import Streetlights from './Streetlights'
import Textarea from './Textarea'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'

const streetLightsLabel = {
  fi: 'Yleisarvio',
  en: 'General assessment',
  se: 'Allmänn bedömning',
}

const textAreaLabel = {
  fi: 'Keskustelun pääkohdat olivat',
  en: 'Main points of discussion',
  se: 'Diskussionens huvudpunkter',
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

  return (
    <>
      <h3>
        {number}. {label}
      </h3>
      <p style={{ lineHeight: 2, backgroundColor: '#ffcd4c2e', padding: '1em' }}>{description}</p>
      {(previousAnswerText || previousAnswerLight) && (
        <LastYearsAnswersAccordion>
          {previousAnswerLight && (
            <img
              style={{ width: '40px', height: 'auto' }}
              src={mapLightToImage[previousAnswerLight]}
            />
          )}
          <ReactMarkdown source={previousAnswerText} />
        </LastYearsAnswersAccordion>
      )}
      {!noLight && (
        <Streetlights id={id} label={streetLightsLabel[languageCode]} required={required} />
      )}
      <Textarea id={id} label={textAreaLabel[languageCode]} required={required} />
    </>
  )
}

export default Entity
