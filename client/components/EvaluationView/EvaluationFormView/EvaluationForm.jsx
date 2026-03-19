/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useSelector } from 'react-redux'
import { formKeys } from '../../../../config/data'

import Textarea from '../../Generic/Textarea'
import Entity from '../../Generic/Entity'
import EntityLevels from '../../Generic/EntityLevels'
import EntityUniversity from '../../Generic/EntityUniversity'
import Measures from '../../Generic/Measures'
import Actions from '../../Generic/Actions'
import { colors, romanize } from '../../../util/common'
import TextareaUniversity from '../../Generic/TextareaUniversity'
import ActionsUniversity from '../../Generic/ActionsUniversity'
import Section from './EvaluationSection'

import './EvaluationForm.scss'

const EvaluationForm = ({ questions, programmeKey, summaryData, form, summaryUrl }) => {
  const lang = useSelector(state => state.language)

  const partComponentMap = {
    TEXTAREA: Textarea,
    TEXTAREA_UNIVERSITY: TextareaUniversity,
    ENTITY: Entity,
    ENTITY_LEVELS: EntityLevels,
    ENTITY_UNIVERSITY: EntityUniversity,
    MEASURES: Measures,
    ACTIONS: Actions,
    ACTIONS_UNIVERSITY: ActionsUniversity,
  }

  let number = 0

  const partMap = part => {
    const summary =
      part.id.includes('meta') ||
      part.id.includes('_opinion_differences') ||
      part.id.includes('programme_strengths') ||
      part.id.includes('seamless_studies')

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

    if (part.type === 'ENTITY' || part.type === 'ENTITY_LEVELS' || part.type === 'ENTITY_UNIVERSITY') number++

    const Component = partComponentMap[part.type]
    const description = part.description ? part.description[lang] : undefined
    const extrainfo = part.extrainfo ? part.extrainfo[lang] : undefined

    const gapSytle = form === formKeys.EVALUATION_COMMTTEES ? { marginBottom: 70 } : {}
    const maxLength = part.maxLength ?? undefined
    const noUniversityLevel = part.noUniversityLevel ?? undefined

    return (
      <div key={`${part.id}-container`} style={gapSytle}>
        <div key={`${part.id}-${part.index}`} style={divStyle}>
          <Component
            description={description}
            extrainfo={extrainfo}
            form={form}
            id={part.id}
            kludge={part.kludge}
            label={part.label[lang]}
            maxLength={maxLength}
            noColor={part.no_color}
            noUniversityLevel={noUniversityLevel}
            number={number}
            previousYearsAnswers={null}
            programme={programmeKey}
            required={part.required}
            summaryData={summaryData?.[part.id] ?? {}}
            summaryUrl={summaryUrl ?? null}
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
            form={form}
            key={`${section.title[lang]}`}
            number={romanize(index + 1)}
            programmeKey={programmeKey}
            title={section.title[lang]}
          >
            {section.parts.map(partMap)}
          </Section>
        )
      })}
    </>
  )
}

export default EvaluationForm
