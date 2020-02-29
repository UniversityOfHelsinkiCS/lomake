import React from 'react'
import Streetlights from './Streetlights'
import Textarea from './Textarea'
import { useSelector } from 'react-redux'

const streetLightsLabel = {
  fi: 'Yleisarvio',
  en: 'General assessment',
  se: 'Allmänn bedömning'
}

const textAreaLabel = {
  fi: 'Keskustelun pääkohdat olivat',
  en: 'Main points of discussion',
  se: 'Diskussionens huvudpunkter'
}

const Entity = ({ id, label, description, required, noLight, number }) => {
  const languageCode = useSelector((state) => state.language)
  return (
    <>
      <h3>
        {number}. {label}
      </h3>
      <p>{description}</p>
      {!noLight && (
        <Streetlights id={id} label={streetLightsLabel[languageCode]} required={required} />
      )}
      <Textarea id={id} label={textAreaLabel[languageCode]} required={required} />
    </>
  )
}

export default Entity
