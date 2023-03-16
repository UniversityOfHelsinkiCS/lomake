import React from 'react'
import { useSelector } from 'react-redux'
import Textarea from 'Components/Generic/Textarea'
import Entity from 'Components/Generic/Entity'
import ChooseRadio from 'Components/Generic/ChooseRadio'
import Slider from 'Components/Generic/Slider'
import InfoBox from 'Components/Generic/InfoBox'
import Measures from 'Components/Generic/Measures'
import Likert from 'Components/Generic/Likert'
import { colors, romanize } from 'Utilities/common'
import Section from './DegreeReformSection'

const Form = ({ questions, programmeKey, form }) => {
  const lang = useSelector(state => state.language)

  const partComponentMap = {
    TEXTAREA: Textarea,
    ENTITY: Entity,
    MEASURES: Measures,
    'CHOOSE-RADIO': ChooseRadio,
    SLIDER: Slider,
    INFOBOX: InfoBox,
    LIKERT: Likert,
  }

  let number = -1

  const partMap = part => {
    const summary =
      part.id.includes('meta') || part.id.includes('information_needed') || part.id.includes('information_used')

    const divStyle = summary
      ? {
          marginTop: '1em !important',
          paddingLeft: '0.5em',
          borderLeft: '5px solid',
          borderColor: colors.background_black,
          marginBottom: '0',
        }
      : {}

    if (part.type === 'TITLE') {
      return (
        <h2 key={part.id} style={divStyle}>
          {part.label[lang]}
        </h2>
      )
    }

    if (!Object.prototype.hasOwnProperty.call(partComponentMap, part.type)) {
      return null
    }

    if (
      part.type === 'ENTITY' ||
      part.type === 'MEASURES' ||
      part.type === 'CHOOSE-RADIO' ||
      part.type === 'SLIDER' ||
      part.type === 'LIKERT'
    )
      number++

    const Component = partComponentMap[part.type]
    const description = part.description ? part.description[lang] : undefined
    const extrainfo = part.extrainfo ? part.extrainfo[lang] : undefined
    const image = part.image ? part.image : undefined
    return (
      <div key={part.id} style={divStyle}>
        <Component
          id={part.id}
          label={part.label[lang]}
          description={description}
          required={part.required}
          noColor={part.no_color}
          number={number}
          extrainfo={extrainfo}
          previousYearsAnswers={null}
          form={form}
          programme={programmeKey}
          radioOptions={part?.radioOptions}
          image={image}
        />
      </div>
    )
  }

  return (
    <>
      {questions.map((section, index) => {
        return (
          <Section
            title={section.title[lang]}
            number={romanize(index)}
            key={section.title[lang]}
            programmeKey={programmeKey}
            form={form}
          >
            {section.parts.map(partMap)}
          </Section>
        )
      })}
    </>
  )
}

export default Form
