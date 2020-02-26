import React from 'react'

import Section from './Section'
import Textarea from 'Components/Generic/Textarea'
import Entity from 'Components/Generic/Entity'
import Measures from 'Components/Generic/Measures'

//https://stackoverflow.com/a/9083076
function romanize(num) {
  if (isNaN(num)) return NaN
  var digits = String(+num).split(''),
    key = [
      '',
      'C',
      'CC',
      'CCC',
      'CD',
      'D',
      'DC',
      'DCC',
      'DCCC',
      'CM',
      '',
      'X',
      'XX',
      'XXX',
      'XL',
      'L',
      'LX',
      'LXX',
      'LXXX',
      'XC',
      '',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX'
    ],
    roman = '',
    i = 3
  while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman
  return Array(+digits.join('') + 1).join('M') + roman
}

const Form = ({ questions }) => {
  const langCode = 'en'

  const partComponentMap = {
    TEXTAREA: Textarea,
    ENTITY: Entity,
    MEASURES: Measures
  }

  let number = 0

  const partMap = (part) => {
    if (!partComponentMap.hasOwnProperty(part.type)) {
      console.error(`No component matching '${part.type}'`)
      return null
    }

    if (part.type === 'ENTITY') number++

    const Component = partComponentMap[part.type]
    const description = part.description ? part.description[langCode] : undefined

    return (
      <Component
        key={part.id}
        id={part.id}
        label={part.label[langCode]}
        description={description}
        required={part.required}
        noLight={part.no_light}
        number={number}
        langCode={langCode}
      />
    )
  }

  return (
    <>
      {questions.map((section, index) => {
        return (
          <Section
            title={section.title[langCode]}
            number={romanize(index + 1)}
            key={section.title[langCode]}
          >
            {section.link_title && section.link_url && (
              <a href={section.link_url}>{section.link_title[langCode]}</a>
            )}
            {section.parts.map(partMap)}
          </Section>
        )
      })}
    </>
  )
}

export default Form
