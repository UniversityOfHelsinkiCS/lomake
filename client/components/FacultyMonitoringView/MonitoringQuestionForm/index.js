import React, { useEffect } from 'react'
import { Form, FormGroup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'
import MonitoringTextarea from 'Components/Generic/MonitoringTextarea'
import TrackingTrafficLight from 'Components/Generic/TrackingTrafficLight'
import DatePickerField from 'Components/Generic/DatePickerField'

const MonitoringQuestionForm = ({ question }) => {
  const { t } = useTranslation()
  const { id } = question
  const form = formKeys.FACULTY_MONITORING

  useEffect(() => {}, [])

  return (
    <Form>
      <TrackingTrafficLight id={id} form={form} />
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
      <FormGroup widths="equal">
        <DatePickerField id={`${id}_start_date`} label={t('formView:facultyStartLabel')} form={form} />
        <DatePickerField id={`${id}_end_date`} label={t('formView:facultyEndLabel')} form={form} />
      </FormGroup>
    </Form>
  )
}

export default MonitoringQuestionForm
