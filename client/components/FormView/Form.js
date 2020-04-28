import React, { useEffect } from 'react'
import Section from './Section'
import Textarea from 'Components/Generic/Textarea'
import Entity from 'Components/Generic/Entity'
import Measures from 'Components/Generic/Measures'
import { useSelector, useDispatch } from 'react-redux'
import { romanize } from 'Utilities/common'
import CSVDownload from './CSVDownload'
import { getPreviousAnswersAction } from 'Utilities/redux/previousAnswersReducer'
import PDFDownload from './PDFDownload'

const Form = ({ questions, programmeKey }) => {
  const previousYearsAnswers = useSelector((state) => state.previousAnswers)
  const dispatch = useDispatch()
  const languageCode = useSelector((state) => state.language)
  const room = useSelector(({ room }) => room)

  useEffect(() => {
    if (room) dispatch(getPreviousAnswersAction(room))
  }, [room])

  const partComponentMap = {
    TEXTAREA: Textarea,
    ENTITY: Entity,
    MEASURES: Measures,
  }

  let number = -1

  const partMap = (part) => {
    if (!partComponentMap.hasOwnProperty(part.type)) {
      console.error(`No component matching '${part.type}'`)
      return null
    }

    if (part.type === 'ENTITY') number++

    const Component = partComponentMap[part.type]
    const description = part.description ? part.description[languageCode] : undefined

    return (
      <Component
        key={part.id}
        id={part.id}
        label={part.label[languageCode]}
        description={description}
        required={part.required}
        noLight={part.no_light}
        number={number}
        previousYearsAnswers={
          previousYearsAnswers.data && previousYearsAnswers.data.data
            ? previousYearsAnswers.data.data
            : null
        }
      />
    )
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <CSVDownload questions={questions} />
        <span style={{ margin: '0 0.5em', color: 'grey' }}>|</span>
        <PDFDownload />
      </div>
      {questions.map((section, index) => {
        return (
          <Section
            title={section.title[languageCode]}
            number={romanize(index)}
            key={section.title[languageCode]}
            programmeKey={programmeKey}
          >
            {section.link_title && section.link_url && (
              <a href={section.link_url}>{section.link_title[languageCode]}</a>
            )}
            {section.parts.map(partMap)}
          </Section>
        )
      })}
    </>
  )
}

export default Form
