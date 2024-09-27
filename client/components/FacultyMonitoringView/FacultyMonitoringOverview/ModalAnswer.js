import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import '../../Generic/Generic.scss'

const ModalAnswer = ({ question, faculty }) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const answers = useSelector(state => state.tempAnswers.data)
  const facultyAnswers = useMemo(() => {
    return answers ? answers.find(answer => answer.programme === faculty)?.data || {} : {}
  }, [answers, faculty])
  const [showAll, setShowAll] = useState(false)
  const lightsHistory = facultyAnswers[`${question.id}_lights_history`]?.reverse() || []
  const displayedHistory = showAll ? lightsHistory : lightsHistory?.slice(0, 4).reverse()

  const formatDate = date => {
    return new Date(date)
      .toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .split('/')
      .join('.')
  }

  if (!answers || answers.pending) {
    return null
  }

  return (
    <>
      <h4>{`${parseInt(question.id, 10)}. ${question.label[lang]}`}</h4>
      <div className="answer-container">
        <div>
          <i>{t(`formView:monitoringTrackingLabel`)}</i>
          <div className="light-container">
            {displayedHistory.length > 0 ? (
              <>
                {displayedHistory.map(entry => (
                  <div className="light" key={entry.date}>
                    <span className={`answer-circle-big-${entry.color}`} />
                    <div className="light-text">
                      <span>{t(`common:${entry.color}Faculty`)}</span>
                      {'  '}
                      <span>{formatDate(entry.date)}</span>
                    </div>
                  </div>
                ))}
                {lightsHistory.length > 4 && (
                  <Button onClick={() => setShowAll(!showAll)} style={{ marginTop: '10px' }}>
                    {showAll ? t('common:showLess') : t('common:showAll')}
                  </Button>
                )}
              </>
            ) : (
              t('formView:noAnswer')
            )}
          </div>
        </div>
        {['actions', 'responsible_entities'].map(fieldName => {
          const labels = {
            actions: 'monitoringActionsLabel',
            responsible_entities: 'monitoringResponsibleLabel',
          }
          return (
            <div className="single-row" key={fieldName}>
              <div>
                <i>{t(`formView:${labels[fieldName]}`)}</i>
                <p>{facultyAnswers[`${question.id}_${fieldName}_text`] || t('formView:noAnswer')}</p>
              </div>
            </div>
          )
        })}
        <div className="two-column-row">
          {['contact_person', 'resources'].map(fieldName => {
            const labels = {
              contact_person: 'monitoringContactLabel',
              resources: 'monitoringResourceLabel',
            }
            return (
              <div key={fieldName} className="flex-item">
                <i>{t(`formView:${labels[fieldName]}`)}</i>
                <p>{facultyAnswers[`${question.id}_${fieldName}_text`] || t('formView:noAnswer')}</p>
              </div>
            )
          })}
        </div>
        <div className="two-column-row">
          {['start_date', 'end_date'].map(fieldName => {
            const labels = {
              start_date: 'monitoringStartLabel',
              end_date: 'monitoringEndLabel',
            }
            return (
              <div key={fieldName} className="flex-item">
                <i>{t(`formView:${labels[fieldName]}`)}</i>
                <p>
                  {facultyAnswers[`${question.id}_${fieldName}_text`]
                    ? formatDate(new Date(facultyAnswers[`${question.id}_${fieldName}_text`]))
                    : t('formView:noAnswer')}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default ModalAnswer
