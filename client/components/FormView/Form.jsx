/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Textarea from '../Generic/Textarea'
import Entity from '../Generic/Entity'
import Measures from '../Generic/Measures'
import Selection from '../Generic/Selection'
import OrderSelection from '../Generic/OrderSelection'
import { colors, romanize } from '../../util/common'
import { getPreviousAnswersAction } from '../../redux/previousAnswersReducer'
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
          description={description}
          extrainfo={extrainfo}
          form={form}
          hidePopup={part.hidePopup}
          id={part.id}
          label={part.label[lang]}
          lang={lang}
          noColor={part.no_color}
          number={number}
          options={part.options}
          previousYearsAnswers={previousYearsAnswers.data?.data ?? null}
          radioOptions={part.radioOptions}
          required={part.required}
        />
      </div>
    )
  }

  return (
    <>
      {questions.map((section, index) => {
        return (
          <Section
            key={section.title[lang]}
            number={romanize(index)}
            programmeKey={programmeKey}
            title={section.title[lang]}
          >
            {section.link_title && section.link_url ? (
              <a className="hide-in-print-mode" href={section.link_url} rel="noreferrer" target="_blank">
                {section.link_title[lang]}
              </a>
            ) : null}
            {section.parts.map(partMap)}
          </Section>
        )
      })}
    </>
  )
}

export default Form
