import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { formKeys } from '../../../config/data'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import './Generic.scss'
import ProgrammeTextAnswerSummary from './ProgrammeTextAnswerSummary'

export const deepCheck = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

const Accordion = ({ previousYearsAnswers, previousAnswerColor, previousAnswerText, id }) => {
  if (previousAnswerText || previousAnswerColor)
    return (
      <LastYearsAnswersAccordion>
        {previousAnswerColor ? <div className={`circle-big-${previousAnswerColor}`} /> : null}
        <ReactMarkdown>{previousAnswerText}</ReactMarkdown>
      </LastYearsAnswersAccordion>
    )

  if (previousYearsAnswers?.[`${id}_text`])
    return (
      <LastYearsAnswersAccordion>
        <ReactMarkdown>{previousYearsAnswers[`${id}_text`]}</ReactMarkdown>
      </LastYearsAnswersAccordion>
    )

  return null
}

const Textarea = ({
  id,
  previousYearsAnswers,
  previousAnswerText,
  previousAnswerColor,
  summaryData,
  form,
  isArviointi,
}) => {
  const { t } = useTranslation()

  const fieldName = `${id}_text`
  const dataFromRedux = useSelector(({ form }) => form.data[fieldName] ?? '')

  const viewOnly = true

  const hasSummaryData = Object.keys(summaryData ?? {}).length > 0 && id.includes('-bachelor')

  let subTitle = null
  if (form === formKeys.EVALUATION_COMMTTEES) {
    if (id.indexOf('-bachelor') > -1) {
      if (!isArviointi) {
        subTitle = t('formView:bachelorUniForm')
      } else {
        subTitle = `${t('bachelor')}`
      }
    } else if (id.indexOf('-master') > -1) {
      if (!isArviointi) {
        subTitle = t('formView:masterUniForm')
      } else {
        subTitle = `${t('master')}`
      }
    } else if (id.indexOf('-doctoral') > -1) {
      if (!isArviointi) {
        subTitle = t('formView:doctoralUniForm')
      } else {
        subTitle = `${t('doctoral')}`
      }
    }
  }

  return (
    <div data-cy={`textarea-${id}`} style={{ marginTop: 0 }}>
      <div
        className="form-text-area"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Accordion
          id={id}
          previousAnswerColor={previousAnswerColor}
          previousAnswerText={previousAnswerText}
          previousYearsAnswers={previousYearsAnswers}
        />
      </div>
      {hasSummaryData ? <ProgrammeTextAnswerSummary form={form} questionId={id} summaryData={summaryData} /> : null}
      {subTitle ? <h3> {subTitle}</h3> : null}
      {viewOnly ? <ReactMarkdown>{dataFromRedux}</ReactMarkdown> : null}
    </div>
  )
}

export default Textarea
