import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { formKeys } from '@root/config/data'
import FacultyEntity from 'Components/Generic/FacultyEntity'
import { colors, romanize } from 'Utilities/common'
import FacultyLevelSection from './FacultyLevelSection'

const FacultyLevelForm = ({ faculty, form, questions }) => {
  const lang = useSelector(state => state.language)

  const partComponentMap = {
    FACULTY_ENTITY: FacultyEntity,
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

    const gapStyle = { marginBottom: 70 }
    const maxLength = part.maxLength ? part.maxLength : undefined

    return (
      <div key={`${part.id}-container`} style={gapStyle}>
        <div key={`${part.id}-${part.index}`} style={divStyle}>
          <Component
            id={part.id}
            label={part.label[lang]}
            description={description}
            required={part.required}
            noColor={part.no_color}
            number={part.index}
            extrainfo={extrainfo}
            previousYearsAnswers={null}
            faculty={faculty}
            form={form}
            kludge={part.kludge}
            maxLength={maxLength}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {questions.map((section, index) => {
        return (
          <FacultyLevelSection title={section.title[lang]} number={romanize(index + 1)} key={`${section.title[lang]}`}>
            {section.parts.map(partMap)}
          </FacultyLevelSection>
        )
      })}
    </>
  )
}

export default FacultyLevelForm
