import { useSelector } from 'react-redux'
import Textarea from '../../Generic/Textarea'
import Entity from '../../Generic/Entity'
import ChooseRadio from '../../Generic/ChooseRadio'
import InfoBox from '../../Generic/InfoBox'
import Measures from '../../Generic/Measures'

import CustomCheckbox from '../../Generic/CustomCheckbox'
import AdvancedRadio from '../../Generic/AdvancedRadio'
import { colors, romanize, getForm, getProgramAnswerLevels } from '../../../util/common'
import { formKeys } from '../../../../config/data'
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
      <h2 key={`question-${part.id}-${formType}-${lang}`} style={divStyle}>
        {part.label[lang]}
      </h2>
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
  const image = part.image ?? undefined
  const direction = part.direction ?? 'vertical'
  const maxLength = part.maxLength ?? undefined
  const accordion = part.accordion ?? undefined
  const version = part.version ?? undefined

  return (
    <div style={divStyle}>
      <Component
        accordion={accordion}
        advancedOptions={part?.advancedOptions}
        description={description}
        direction={direction}
        extrainfo={extrainfo}
        form={form}
        formType={formType}
        hidePopup={part.hidePopup}
        id={part.id}
        image={image}
        label={part.label[lang]}
        marginTop={part.marginTop}
        maxLength={maxLength}
        noColor={part.no_color}
        number={number}
        previousYearsAnswers={null}
        programme={programmeKey}
        radioOptions={part?.radioOptions}
        required={part.required}
        version={version}
      />
    </div>
  )
}

const DegreeReformForm = ({ programmeKey, formType, questionData }) => {
  const lang = useSelector(state => state.language)
  const formData = useSelector(state => state.form ?? {})
  const form = getForm(formType)

  let number = -1

  let programAnswerLevels = []
  if (programmeKey) {
    programAnswerLevels = getProgramAnswerLevels(programmeKey)
  }

  return (
    <div style={{ marginTop: -50 }}>
      {questionData.map((section, index) => {
        if (form !== formKeys.DEGREE_REFORM_PROGRAMMES && formData.answerLevels.find(f => f === section.id)) {
          return null
        }
        if (form === formKeys.DEGREE_REFORM_PROGRAMMES && programAnswerLevels.find(f => f === section.id)) {
          return null
        }

        const parts = form !== 2 ? section.parts : section.parts.filter(p => !p.notInProgrammeView)

        return (
          <Section
            formType={formType}
            id={section.id}
            key={`section-${section.id}-${formType}-${lang}`}
            number={romanize(index)}
            programmeKey={programmeKey}
            title={section.title[lang]}
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
                  form={form}
                  formData={formData}
                  formType={formType}
                  key={`${part.type}-${part.id}-${formType}-${lang}`}
                  lang={lang}
                  number={number}
                  part={part}
                  programAnswerLevels={programAnswerLevels}
                  programmeKey={programmeKey}
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
