import React from 'react'
// import ReactMarkdown from 'react-markdown'
import { Divider } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
// import { Link } from 'react-router-dom'

import { colors } from 'Utilities/common'
import Textarea from './Textarea'
import TrafficLights from './TrafficLights'
import './Generic.scss'

// const mapColorToValid = {
//   VIHREÄ: 'green',
//   KELTAINEN: 'yellow',
//   PUNAINEN: 'red',
// }

const EntityLevels = ({
  id,
  label,
  description,
  required,
  // noColor,
  number,
  extrainfo,
  // formType,
  // relatedYearlyAnswers = null,
  form,
  // summaryUrl,
}) => {
  const { t } = useTranslation()

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
        <div>
          <TrafficLights id={`${id}_bachelor`} form={form} />
          <label>{t('bachelor')}</label>
        </div>
        <div>
          <TrafficLights id={`${id}_master`} form={form} />
          <label>{t('master')}</label>
        </div>
        <div>
          <TrafficLights id={`${id}_doctor`} form={form} />
          <label>{t('doctoral')}</label>
        </div>
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
      {/* <OldAnswersSummary partId={id} relatedYearlyAnswers={relatedYearlyAnswers} /> */}
      {/* {formType === 'evaluation' && (
        <Link data-cy="link-to-old-answers" to={summaryUrl} target="_blank">
          <p style={{ marginTop: '1em' }}>Kaikki vuosiseurannan vuodet</p>
        </Link>
      )} */}
      <Textarea id={id} label={t('generic:textAreaLabel')} EntityLastYearsAccordion={null} form={form} />
    </div>
  )
}

export default EntityLevels
