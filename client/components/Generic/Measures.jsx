/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { colors } from '../../util/common'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import SimpleTextarea from './SimpleTextarea'
import './Generic.scss'

const Measures = ({ label, id, required, number, previousYearsAnswers, extrainfo, form }) => {
  const { t } = useTranslation()
  const formData = useSelector(state => state.form.data)
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const [amountOfMeasures, setAmountOfMeasures] = useState(1)

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
    if (previousYearsAnswers[`${id}_text`]) return previousYearsAnswers[`${id}_text`]

    if (previousYearsAnswers[`${id}_1_text`]) {
      let measures = ''
      let i = 1
      while (i < 6) {
        if (previousYearsAnswers[`${id}_${i}_text`]) measures += `${i}) ${previousYearsAnswers[`${id}_${i}_text`]}  \n`
        i++
      }

      return measures
    }

    return null
  }

  const previousAnswerText = getPreviousMeasureAnswers()

  return (
    <>
      <h3>
        {number}. {label} {required ? <span style={{ color: colors.red, marginLeft: '0.2em' }}>*</span> : null}
      </h3>
      <p
        className="hide-in-print-mode"
        style={{
          lineHeight: 2,
          backgroundColor: colors.background_blue,
          padding: '1em',
          borderRadius: '5px',
          margin: '1em 0',
        }}
      >
        {t('generic:measureLabel')} <span className="form-question-extrainfo">{extrainfo}</span>
      </p>
      {previousAnswerText ? (
        <LastYearsAnswersAccordion>
          <ReactMarkdown>{previousAnswerText}</ReactMarkdown>
        </LastYearsAnswersAccordion>
      ) : null}
      {['', '', '', '', ''].reduce((acc, cur, index) => {
        if (index + 1 > amountOfMeasures) return acc
        acc.push(
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} style={{ paddingTop: '0' }}>
            <SimpleTextarea form={form} id={`${id}_${index + 1}`} label={`${index + 1})`} viewOnly={viewOnly} />
          </div>
        )
        return acc
      }, [])}
    </>
  )
}

export default Measures
