import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'
import CustomModal from 'Components/Generic/CustomModal'
import { getTempAnswersByForm } from 'Utilities/redux/tempAnswersReducer'
import MonitoringQuestionForm from '../MonitoringQuestionForm/index'
import '../../Generic/Generic.scss'

const Answer = ({ question, faculty, modify = true }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const form = formKeys.FACULTY_MONITORING
  const lang = useSelector(state => state.language)
  const answers = useSelector(state => state.tempAnswers.data)
  const [formModalData, setFormModalData] = useState(null)
  const facultyAnswers = useMemo(() => {
    return answers ? answers.find(answer => answer.programme === faculty)?.data || {} : {}
  }, [answers, faculty])
  const lightsHistory = facultyAnswers[`${question.id}_lights_history`]

  useEffect(() => {
    dispatch(getTempAnswersByForm(form))
  }, [])

  const openFormModal = question => {
    setFormModalData(question)
  }

  const closeFormModal = () => {
    dispatch(getTempAnswersByForm(form))
    setFormModalData(null)
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
            {lightsHistory
              ? lightsHistory.map(entry => (
                  <div className="light" key={entry.date}>
                    <span className={`answer-circle-big-${entry.color}`} />
                    <div className="light-text">
                      <span>{t(`common:${entry.color}Faculty`)}</span>
                      {'  '}
                      <span>
                        {new Date(entry.date)
                          .toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                          .split('/')
                          .join('.')}
                      </span>
                    </div>
                  </div>
                ))
              : t('formView:noAnswer')}
          </div>
        </div>
        <div className="single-row">
          {['actions', 'responsible_entities'].map(fieldName => {
            const labels = {
              actions: 'monitoringActionsLabel',
              responsible_entities: 'monitoringResponsibleLabel',
            }
            return (
              <React.Fragment key={fieldName} style={{ marginBottom: '20px' }}>
                <i>{t(`formView:${labels[fieldName]}`)}</i>
                <p>{facultyAnswers[`${question.id}_${fieldName}_text`] || t('formView:noAnswer')}</p>
              </React.Fragment>
            )
          })}
        </div>
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
                    ? new Date(facultyAnswers[`${question.id}_${fieldName}_text`])
                        .toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        .split('/')
                        .join('.')
                    : t('formView:noAnswer')}
                </p>
              </div>
            )
          })}
        </div>
        {modify && (
          <div className="button-container">
            <Button onClick={() => openFormModal(question)} content={t('formView:modifyPlan')} />
          </div>
        )}
      </div>
      {formModalData && (
        <CustomModal
          closeModal={closeFormModal}
          title={`${parseInt(formModalData.id, 10)} - ${formModalData.label[lang]}`}
        >
          <MonitoringQuestionForm question={formModalData} faculty={faculty} />
          <Button secondary style={{ marginTop: '1em', float: 'right' }} onClick={closeFormModal}>
            {t('formView:sendForm')}
          </Button>
        </CustomModal>
      )}
    </>
  )
}

export default Answer
