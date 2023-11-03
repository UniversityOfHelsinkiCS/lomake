import React from 'react'
import { useSelector } from 'react-redux'
import Textarea from 'Components/Generic/Textarea'
import Entity from 'Components/Generic/Entity'
import EntityLevels from 'Components/Generic/EntityLevels'
import Measures from 'Components/Generic/Measures'
import Actions from 'Components/Generic/Actions'
import { colors, romanize } from 'Utilities/common'
import Section from './EvaluationSection'

import './EvaluationForm.scss'

const EvaluationForm = ({ questions, programmeKey, summaryData, form, summaryUrl }) => {
  const lang = useSelector(state => state.language)

  const partComponentMap = {
    TEXTAREA: Textarea,
    ENTITY: Entity,
    ENTITY_LEVELS: EntityLevels,
    MEASURES: Measures,
    ACTIONS: Actions,
  }

  let number = 0

  const partMap = part => {
    const summary =
      part.id.includes('meta') || part.id.includes('_opinion_differences') || part.id.includes('programme_strengths')

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
      if (part.label.fi === 'KOULUTUSOHJELMAN KIRJAUKSET') {
        return (
          <h2
            key={part.id}
            style={{
              marginTop: '1em !important',
              padding: '0.5em',
              borderRadius: '5px',
              backgroundColor: colors.background_blue,
              marginBottom: '0',
            }}
          >
            {part.label[lang]}
          </h2>
        )
      }
      return (
        <h2 key={`${part.id}-${part.index}`} style={divStyle}>
          {part.label[lang]}
        </h2>
      )
    }

    if (!Object.prototype.hasOwnProperty.call(partComponentMap, part.type)) {
      return null
    }

    if (part.type === 'ENTITY' || part.type === 'ENTITY_LEVELS') number++

    const Component = partComponentMap[part.type]
    const description = part.description ? part.description[lang] : undefined
    const extrainfo = part.extrainfo ? part.extrainfo[lang] : undefined

    return (
      <div key={`${part.id}-container`}>
        <div key={`${part.id}-${part.index}`} style={divStyle}>
          <Component
            id={part.id}
            label={part.label[lang]}
            description={description}
            required={part.required}
            noColor={part.no_color}
            number={number}
            extrainfo={extrainfo}
            previousYearsAnswers={null}
            programme={programmeKey}
            summaryData={summaryData?.[part.id] || {}}
            form={form}
            summaryUrl={summaryUrl || null}
            kludge={part.kludge}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {questions.map((section, index) => {
        return (
          <Section
            title={section.title[lang]}
            number={romanize(index + 1)}
            key={`${section.title[lang]}`}
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

export default EvaluationForm
