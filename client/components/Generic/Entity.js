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
  summaryData = null,
  form,
  summaryUrl,
  kludge,
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

  let textAreaLabel = t('generic:textAreaLabel')
  if (kludge && id === 'studyprogramme_status') {
    textAreaLabel = t('generic:kludgedLabel')
  }
  if (kludge && id !== 'studyprogramme_status') {
    textAreaLabel = t('generic:kludgedLabel2')
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
      <div className="entity-description">
        {description}
        <p className="form-question-extrainfo">{extrainfo}</p>
      </div>
      {!kludge && form === 4 && (
        <>
          <OldAnswersSummary partId={id} relatedYearlyAnswers={summaryData} />
          <Link data-cy="link-to-old-answers" to={summaryUrl} target="_blank">
            <p style={{ marginTop: '1em' }}>{t('formView:allYearlyAnswerYears')}</p>
          </Link>
        </>
      )}
      <Textarea
        id={id}
        label={textAreaLabel}
        EntityLastYearsAccordion={EntityLastYearsAccordion}
        form={form}
        kludge={kludge}
      />
    </div>
  )
}

export default Entity
