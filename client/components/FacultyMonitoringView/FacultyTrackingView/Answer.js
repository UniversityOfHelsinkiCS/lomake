import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import CustomModal from 'Components/Generic/CustomModal'
import MonitoringQuestionForm from '../MonitoringQuestionForm/index'
import '../../Generic/Generic.scss'

const Answer = ({ answer, question, faculty }) => {
  const { t } = useTranslation()
  const [formModalData, setFormModalData] = useState(null)
  const lightsHistory = answer[`${question.id}_lights_history`]

  const openFormModal = question => {
    setFormModalData(question)
  }

  const closeFormModal = () => {
    setFormModalData(null)
  }

  return (
    <>
      <div className="answer-container">
        <h4>{`${parseInt(question.id, 10)} - ${question.label}`}</h4>

        <div>
          <i>{t(`formView:monitoringTrackingLabel`)}</i>
          <div className="light-container">
            {lightsHistory
              ? lightsHistory.map(entry => (
                  <div className="light">
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
            //  todo: change schedule field to start and end
          }
          return (
            <>
              <i>{t(`formView:${labels[fieldName]}`)}</i>{' '}
              <p key={fieldName}>{answer[`${question.id}_${fieldName}_text`] || t('formView:noAnswer')}</p>
            </>
          )
        })}

        <Button onClick={() => openFormModal(question)} content={t('formView:modifyPlan')} />
      </div>

      {formModalData && (
        <CustomModal closeModal={closeFormModal} title={`${parseInt(formModalData.id, 10)} - ${formModalData.label}`}>
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
