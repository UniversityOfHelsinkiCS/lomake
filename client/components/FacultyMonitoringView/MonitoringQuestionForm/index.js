import React from 'react'
import { Form, FormButton, FormGroup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'
import MonitoringTextarea from 'Components/Generic/MonitoringTextarea'

const MonitoringQuestionForm = ({ question, faculty }) => {
  const { t } = useTranslation()
  const { id } = question
  const form = formKeys.FACULTY_MONITORING

  const handleSubmit = null

  return (
    <Form onSubmit={handleSubmit} key={faculty}>
      <FormGroup widths="equal">
        <MonitoringTextarea
          id={`${id}_actions_${faculty}`}
          label={t('formView:facultyActionsLabel')}
          form={form}
          className="textarea"
        />
      </FormGroup>
      <FormGroup widths="equal">
        <MonitoringTextarea
          id={`${id}_responsible_entities_${faculty}`}
          label={t('formView:facultyEntitiesLabel')}
          form={form}
        />
      </FormGroup>
      <FormGroup widths="equal">
        <MonitoringTextarea
          id={`${id}_contact_person_${faculty}`}
          label={t('formView:facultyContactLabel')}
          required
          form={form}
        />
        <MonitoringTextarea id={`${id}_resources_${faculty}`} label={t('formView:facultyResourcesLabel')} form={form} />
      </FormGroup>
      <MonitoringTextarea id={`${id}_schedule_${faculty}`} label={t('formView:facultyScheduleLabel')} form={form} />
      <div style={{ textAlign: 'right' }}>
        <FormButton secondary type="submit">
          {t('formView:sendForm')}
        </FormButton>
      </div>
    </Form>
  )
}

export default MonitoringQuestionForm
