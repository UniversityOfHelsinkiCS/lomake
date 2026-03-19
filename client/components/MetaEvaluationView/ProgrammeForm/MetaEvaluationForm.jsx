import { useSelector } from 'react-redux'
import { formKeys } from '../../../../config/data'

import MetaEntity from '../../Generic/MetaEntity'
import { colors, romanize } from '../../../util/common'
import MetaEvaluationSection from './MetaEvaluationSection'

import './EvaluationForm.scss'

const MetaEvaluationForm = ({ questions, programmeKey, summaryData, form, summaryUrl }) => {
  const lang = useSelector(state => state.language)

  const partComponentMap = {
    META_ENTITY: MetaEntity,
  }

  const partMap = part => {
    const divStyle = {
      marginTop: '1em !important',
      paddingLeft: '0.5em',
      borderLeft: '5px solid',
      borderColor: colors.background_black,
      marginBottom: '0',
    }

    if (part.type === 'TITLE') {
      return (
        <h2 key={`${part.id}-${part.index}`} style={divStyle}>
          {part.label[lang]}
        </h2>
      )
    }

    if (!Object.prototype.hasOwnProperty.call(partComponentMap, part.type)) {
      return null
    }

    const Component = partComponentMap[part.type]
    const description = part.description ? part.description[lang] : undefined
    const extrainfo = part.extrainfo ? part.extrainfo[lang] : undefined

    const gapStyle = form === formKeys.EVALUATION_COMMTTEES ? { marginBottom: 70 } : {}
    const maxLength = part.maxLength ?? undefined

    return (
      <div key={`${part.id}-container`} style={gapStyle}>
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
            number={part.index}
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
          <MetaEvaluationSection
            key={`${section.title[lang]}`}
            number={romanize(index + 1)}
            programmeKey={programmeKey}
            title={section.title[lang]}
          >
            {section.parts.map(partMap)}
          </MetaEvaluationSection>
        )
      })}
    </>
  )
}

export default MetaEvaluationForm
