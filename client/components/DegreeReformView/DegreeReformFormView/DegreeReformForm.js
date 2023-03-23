import React from 'react'
import { useSelector } from 'react-redux'
import Textarea from 'Components/Generic/Textarea'
import Entity from 'Components/Generic/Entity'
import ChooseRadio from 'Components/Generic/ChooseRadio'
import Slider from 'Components/Generic/Slider'
import InfoBox from 'Components/Generic/InfoBox'
import Measures from 'Components/Generic/Measures'

import CustomCheckbox from 'Components/Generic/CustomCheckbox'
import AdvancedRadio from 'Components/Generic/AdvancedRadio'
import { colors, romanize } from 'Utilities/common'
import Section from './DegreeReformSection'

const Form = ({ questions, programmeKey, form }) => {
  const lang = useSelector(state => state.language)
  const filter = useSelector(state => state.filters || {})

  const partComponentMap = {
    TEXTAREA: Textarea,
    ENTITY: Entity,
    MEASURES: Measures,
    'CHOOSE-RADIO': ChooseRadio,
    SLIDER: Slider,
    INFOBOX: InfoBox,
    'CHOOSE-ADVANCED': AdvancedRadio,
    CHECKBOX: CustomCheckbox,
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
    if (filter.answerLevels.length > 0 && filter.answerLevels.find(f => f === part.id)) {
      return <div />
    }

    if (!Object.prototype.hasOwnProperty.call(partComponentMap, part.type)) {
      return null
    }

    if (
      part.type === 'ENTITY' ||
      part.type === 'MEASURES' ||
      part.type === 'CHOOSE-RADIO' ||
      part.type === 'SLIDER' ||
      part.type === 'CHOOSE-ADVANCED' ||
      part.type === 'CHECKBOX'
    )
      number++

    const Component = partComponentMap[part.type]
    const description = part.description ? part.description[lang] : undefined
    const extrainfo = part.extrainfo ? part.extrainfo[lang] : undefined
    const image = part.image ? part.image : undefined
    const direction = part.direction ? part.direction : 'vertical'
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
          direction={direction}
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
            {filter.answerLevels.length > 0 && filter.answerLevels.find(f => f === section.id) ? (
              <div />
            ) : (
              section.parts.map(partMap)
            )}
          </Section>
        )
      })}
    </>
  )
}

export default Form
