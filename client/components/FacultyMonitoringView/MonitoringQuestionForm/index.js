import React from 'react'
import { Form, FormButton, FormGroup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'
import MonitoringTextarea from 'Components/Generic/MonitoringTextarea'
import TrackingTrafficLight from 'Components/Generic/TrackingTrafficLight'

const MonitoringQuestionForm = ({ question }) => {
  const { t } = useTranslation()
  const { id } = question
  const form = formKeys.FACULTY_MONITORING

  const handleSubmit = null

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup widths="equal">
        <TrackingTrafficLight id={id} form={form} />
      </FormGroup>
      <FormGroup widths="equal">
        <MonitoringTextarea
          id={`${id}_actions`}
          label={t('formView:facultyActionsLabel')}
          form={form}
          className="textarea"
        />
      </FormGroup>
      <FormGroup widths="equal">
        <MonitoringTextarea id={`${id}_responsible_entities`} label={t('formView:facultyEntitiesLabel')} form={form} />
      </FormGroup>
      <FormGroup widths="equal">
        <MonitoringTextarea
          id={`${id}_contact_person`}
          label={t('formView:facultyContactLabel')}
          required
          form={form}
        />
        <MonitoringTextarea id={`${id}_resources`} label={t('formView:facultyResourcesLabel')} form={form} />
      </FormGroup>
      <MonitoringTextarea id={`${id}_schedule`} label={t('formView:facultyScheduleLabel')} form={form} />
      <div style={{ textAlign: 'right' }}>
        <FormButton secondary type="submit">
          {t('formView:sendForm')}
        </FormButton>
      </div>
    </Form>
  )
}

export default MonitoringQuestionForm
