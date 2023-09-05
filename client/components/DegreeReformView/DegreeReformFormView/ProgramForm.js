import React from 'react'
import { useSelector } from 'react-redux'
import Textarea from 'Components/Generic/Textarea'
import Entity from 'Components/Generic/Entity'
import ChooseRadio from 'Components/Generic/ChooseRadio'
import InfoBox from 'Components/Generic/InfoBox'
import Measures from 'Components/Generic/Measures'

import CustomCheckbox from 'Components/Generic/CustomCheckbox'
import AdvancedRadio from 'Components/Generic/AdvancedRadio'
import { colors, romanize, getForm, getProgramAnswerLevels } from 'Utilities/common'
import Section from './DegreeReformSection'

const partComponentMap = {
  TEXTAREA: Textarea,
  ENTITY: Entity,
  MEASURES: Measures,
  'CHOOSE-RADIO': ChooseRadio,
  INFOBOX: InfoBox,
  'CHOOSE-ADVANCED': AdvancedRadio,
  CHECKBOX: CustomCheckbox,
}

const Part = ({ part, programAnswerLevels, formData, lang, formType, programmeKey, form, number }) => {
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
      <>
        <h2 key={`question-${part.id}-${formType}-${lang}`} style={divStyle}>
          {part.label[lang]}
        </h2>
      </>
    )
  }
  if (formData.answerLevels.length > 0 && formData.answerLevels.find(f => f === part.id)) {
    return <div />
  }
  if (programAnswerLevels.length > 0 && programAnswerLevels.find(f => f === part.id)) {
    return <div />
  }

  if (!Object.prototype.hasOwnProperty.call(partComponentMap, part.type)) {
    return null
  }

  const Component = partComponentMap[part.type]
  const description = part.description ? part.description[lang] : undefined
  const extrainfo = part.extrainfo ? part.extrainfo[lang] : undefined
  const image = part.image ? part.image : undefined
  const direction = part.direction ? part.direction : 'vertical'
  const maxLength = part.maxLength ? part.maxLength : undefined
  const accordion = part.accordion ? part.accordion : undefined
  const version = part.version ? part.version : undefined

  return (
    <div style={divStyle}>
      <Component
        id={part.id}
        label={part.label[lang]}
        description={description}
        required={part.required}
        noColor={part.no_color}
        number={number}
        extrainfo={extrainfo}
        previousYearsAnswers={null}
        formType={formType}
        programme={programmeKey}
        radioOptions={part?.radioOptions}
        advancedOptions={part?.advancedOptions}
        image={image}
        direction={direction}
        maxLength={maxLength}
        accordion={accordion}
        form={form}
        version={version}
        hidePopup={part.hidePopup}
        marginTop={part.marginTop}
      />
    </div>
  )
}

const DegreeReformForm = ({ programmeKey, formType, questionData }) => {
  const lang = useSelector(state => state.language)
  const formData = useSelector(state => state.form || {})
  const form = getForm(formType)

  let number = -1

  let programAnswerLevels = []
  if (programmeKey) {
    programAnswerLevels = getProgramAnswerLevels(programmeKey)
  }

  return (
    <div style={{ marginTop: -50 }}>
      {questionData
        .filter(section => {
          if (form !== 2 && formData.answerLevels.find(f => f === section.id)) {
            return false
          }
          if (form === 2 && programAnswerLevels.find(f => f === section.id)) {
            return false
          }
          return true
        })
        .map((section, index) => {
          const parts = form !== 2 ? section.parts : section.parts.filter(p => !p.notInProgrammeView)

          return (
            <Section
              id={section.id}
              title={section.title[lang]}
              number={romanize(index)}
              key={`section-${section.id}-${formType}-${lang}`}
              programmeKey={programmeKey}
              formType={formType}
            >
              {parts.map(part => {
                if (
                  part.type === 'ENTITY' ||
                  part.type === 'MEASURES' ||
                  part.type === 'CHOOSE-RADIO' ||
                  part.type === 'CHOOSE-ADVANCED' ||
                  part.type === 'CHECKBOX'
                ) {
                  number++
                }

                return (
                  <Part
                    key={`${part.type}-${part.id}-${formType}-${lang}`}
                    part={part}
                    programAnswerLevels={programAnswerLevels}
                    formData={formData}
                    lang={lang}
                    formType={formType}
                    programmeKey={programmeKey}
                    form={form}
                    number={number}
                  />
                )
              })}
            </Section>
          )
        })}
    </div>
  )
}

export default DegreeReformForm
