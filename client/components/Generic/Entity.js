import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Divider } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { colors } from 'Utilities/common'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import Textarea from './Textarea'
import TrafficLights from './TrafficLights'
import './Generic.scss'
import OldAnswersSummary from './OldAnswersSummary'

const mapColorToValid = {
  VIHREÄ: 'green',
  KELTAINEN: 'yellow',
  PUNAINEN: 'red',
}

const Entity = ({
  id,
  label,
  description,
  required,
  noColor,
  number,
  previousYearsAnswers,
  extrainfo,
  formType,
  summaryData = null,
  form,
  summaryUrl,
}) => {
  const { t } = useTranslation()

  let previousAnswerColor = previousYearsAnswers ? previousYearsAnswers[`${id}_light`] : null
  if (['VIHREÄ', 'KELTAINEN', 'PUNAINEN'].indexOf(previousAnswerColor) !== -1) {
    previousAnswerColor = mapColorToValid[previousAnswerColor]
  }
  const previousAnswerText = previousYearsAnswers ? previousYearsAnswers[`${id}_text`] : null

  const EntityLastYearsAccordion = () => {
    if (!previousAnswerText && !previousAnswerColor) return null
    return (
      <LastYearsAnswersAccordion>
        {previousAnswerColor && <div className={`circle-big-${previousAnswerColor}`} />}
        <ReactMarkdown>{previousAnswerText}</ReactMarkdown>
      </LastYearsAnswersAccordion>
    )
  }
  return (
    <div className="form-entity-area">
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '500px' }}>
          <h3>
            {number}. {label}{' '}
            {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
          </h3>
        </div>
        {!noColor && <TrafficLights id={id} form={form} />}
      </div>
      <div
        className="entity-description"
        style={{
          lineHeight: 2,
          backgroundColor: colors.background_beige,
          padding: '1em',
          borderRadius: '5px',
          margin: '1em 0',
        }}
      >
        {description}
        <p className="form-question-extrainfo">{extrainfo}</p>
      </div>
      {form === 4 && <OldAnswersSummary partId={id} relatedYearlyAnswers={summaryData} />}
      {formType === 'evaluation' && (
        <Link data-cy="link-to-old-answers" to={summaryUrl} target="_blank">
          <p style={{ marginTop: '1em' }}>Kaikki vuosiseurannan vuodet</p>
        </Link>
      )}
      <Textarea
        id={id}
        label={t('generic:textAreaLabel')}
        EntityLastYearsAccordion={EntityLastYearsAccordion}
        form={form}
      />
    </div>
  )
}

export default Entity
