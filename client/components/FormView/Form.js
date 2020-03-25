import React, { useEffect } from 'react'
import { getPreviousAnswersAction } from 'Utilities/redux/previousAnswersReducer'
import Section from './Section'
import Textarea from 'Components/Generic/Textarea'
import Entity from 'Components/Generic/Entity'
import Measures from 'Components/Generic/Measures'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
import { romanize } from 'Utilities/common'
import CSVDownload from './CSVDownload'
import { saveAnswersAction } from 'Utilities/redux/answersReducer'

const submitButtonText = {
  fi: 'Välitallenna',
  en: 'Save current',
  se: ''
}

const previousYearsAnswers = {
  cooperation_success_light: 'VIHREÄ',
  cooperation_success_text:
    'Yhteistyö toimii hyvin, yhteishenki on hyvä. Tarve laajentaa johtoryhmää siten, että edustus tulisi myös harjoittelukouluista'
}

const Form = ({ questions }) => {
  const dispatch = useDispatch()
  const room = useSelector(({ room }) => room)
  const languageCode = useSelector((state) => state.language)
  const formData = useSelector(({ form }) => form.data)

  useEffect(() => {
    dispatch(getPreviousAnswersAction(room))
  }, [])

  const handleSubmit = () => {
    dispatch(saveAnswersAction({ data: formData, room }))
  }

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
        previousYearsAnswers={previousYearsAnswers}
      />
    )
  }

  return (
    <>
      <CSVDownload questions={questions} />
      {questions.map((section, index) => {
        return (
          <Section
            title={section.title[languageCode]}
            number={romanize(index + 1)}
            key={section.title[languageCode]}
          >
            {section.link_title && section.link_url && (
              <a href={section.link_url}>{section.link_title[languageCode]}</a>
            )}
            {section.parts.map(partMap)}
          </Section>
        )
      })}
      <div style={{ maxWidth: '250px', marginTop: '2em' }}>
        {/*TODO: Button should be disabled and help text shown when missing required fields or text value over allowed */}
        <Button secondary onClick={() => handleSubmit()}>
          {submitButtonText[languageCode]}
        </Button>
      </div>
    </>
  )
}

export default Form
