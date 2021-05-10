import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import SimpleTextarea from './SimpleTextarea'
import { colors } from 'Utilities/common'
import { genericTranslations as translations } from 'Utilities/translations'

const Measures = ({ label, id, required, number, previousYearsAnswers, extrainfo }) => {
  const formData = useSelector((state) => state.form.data)
  const lang = useSelector((state) => state.language)
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  useEffect(() => {
    let measureNumber = 5
    while (measureNumber >= 1) {
      if (!formData[`${id}_${measureNumber}_text`]) {
        measureNumber--
      } else {
        break
      }
    }

    setAmountOfMeasures(measureNumber + 1)
  }, [formData])

  const getPreviousMeasureAnswers = () => {
    if (!previousYearsAnswers) return null
    if (!!previousYearsAnswers[`${id}_text`]) return previousYearsAnswers[`${id}_text`]

    if (!!previousYearsAnswers[`${id}_1_text`]) {
      let measures = ''
      let i = 1
      while (i < 6) {
        if (!!previousYearsAnswers[`${id}_${i}_text`])
          measures += `${i}) ${previousYearsAnswers[`${id}_${i}_text`]}  \n`
        i++
      }

      return measures
    }

    return null
  }

  const previousAnswerText = getPreviousMeasureAnswers()

  const [amountOfMeasures, setAmountOfMeasures] = useState(1)

  return (
    <>
      <h3>
        {number}. {label}{' '}
        {required && <span style={{ color: colors.red, marginLeft: '0.2em' }}>*</span>}
      </h3>
      <p
        className="measures-label"
        style={{
          lineHeight: 2,
          backgroundColor: colors.background_blue,
          padding: '1em',
          borderRadius: '5px',
          margin: '1em 0',
        }}
      >
        {translations.measureLabel[lang]}
        <p className="form-question-extrainfo">{extrainfo}</p>
      </p>
      {previousAnswerText && (
        <LastYearsAnswersAccordion>
          <ReactMarkdown source={previousAnswerText} />
        </LastYearsAnswersAccordion>
      )}
      {['', '', '', '', ''].reduce((acc, cur, index) => {
        if (index + 1 > amountOfMeasures) return acc
        acc.push(
          <div style={{ paddingTop: '0' }} key={index}>
            <SimpleTextarea label={`${index + 1})`} id={`${id}_${index + 1}`} viewOnly={viewOnly} />
          </div>
        )
        return acc
      }, [])}
    </>
  )
}

export default Measures
