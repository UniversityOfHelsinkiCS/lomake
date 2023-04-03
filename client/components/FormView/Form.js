import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Textarea from 'Components/Generic/Textarea'
import Entity from 'Components/Generic/Entity'
import Measures from 'Components/Generic/Measures'
import Selection from 'Components/Generic/Selection'
import OrderSelection from 'Components/Generic/OrderSelection'
import { colors, romanize } from 'Utilities/common'
import { getPreviousAnswersAction } from 'Utilities/redux/previousAnswersReducer'
import Section from './Section'

const Form = ({ questions, programmeKey, form }) => {
  const previousYearsAnswers = useSelector(state => state.previousAnswers)
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const room = useSelector(({ room }) => room)

  useEffect(() => {
    if (room) dispatch(getPreviousAnswersAction(room, 1))
  }, [room])

  const partComponentMap = {
    TEXTAREA: Textarea,
    ENTITY: Entity,
    MEASURES: Measures,
    SELECTION: Selection,
    ORDER: OrderSelection,
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
      part.type === 'SELECTION'
    ) {
      number++
    }

    const Component = partComponentMap[part.type]
    const description = part.description ? part.description[lang] : undefined
    const extrainfo = part.extrainfo ? part.extrainfo[lang] : undefined
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
          options={part.options}
          lang={lang}
          previousYearsAnswers={
            previousYearsAnswers.data && previousYearsAnswers.data.data ? previousYearsAnswers.data.data : null
          }
          radioOptions={part.radioOptions}
          form={form}
          formType="yearlyAssessment"
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
          >
            {section.link_title && section.link_url && (
              <a className="hide-in-print-mode" target="_blank" href={section.link_url} rel="noreferrer">
                {section.link_title[lang]}
              </a>
            )}
            {section.parts.map(partMap)}
          </Section>
        )
      })}
    </>
  )
}

export default Form
