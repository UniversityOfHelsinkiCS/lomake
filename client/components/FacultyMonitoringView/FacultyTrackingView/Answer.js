import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Loader } from 'semantic-ui-react'
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
      <div className="answer-container">
        <h4>{`${parseInt(question.id, 10)}. ${question.label[lang]}`}</h4>
        <div>
          <i>{t(`formView:monitoringTrackingLabel`)}</i>
          <div className="light-container">
            {lightsHistory
              ? lightsHistory.map(entry => (
                  <div className="light" key={entry.date}>
                    <span className={`answer-circle-big-${entry.color}`} />
                    <i>
                      {new Date(entry.date)
                        .toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        .split('/')
                        .join('.')}
                    </i>
                  </div>
                ))
              : t('formView:noAnswer')}
          </div>
        </div>
        {['actions', 'responsible_entities', 'contact_person', 'resources', 'schedule'].map(fieldName => {
          const labels = {
            actions: 'monitoringActionsLabel',
            responsible_entities: 'monitoringResponsibleLabel',
            contact_person: 'monitoringContactLabel',
            resources: 'monitoringResourceLabel',
            schedule: 'monitoringStartLabel',
          }
          return (
            <React.Fragment key={fieldName}>
              <i>{t(`formView:${labels[fieldName]}`)}</i>{' '}
              <p key={fieldName}>{facultyAnswers[`${question.id}_${fieldName}_text`] || t('formView:noAnswer')}</p>
            </React.Fragment>
          )
        })}
        {modify && (
          <Button
            style={{ float: 'right' }}
            onClick={() => openFormModal(question)}
            content={t('formView:modifyPlan')}
          />
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
