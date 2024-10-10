import React from 'react'
import { Form, FormGroup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'
import MonitoringTextarea from 'Components/Generic/MonitoringTextarea'
import TrackingTrafficLight from 'Components/Generic/TrackingTrafficLight'
import DatePickerField from 'Components/Generic/DatePickerField'
import TrackingRadioButton from 'Components/Generic/TrackingRadioButton'

const MonitoringQuestionForm = ({ question }) => {
  const { t } = useTranslation()
  const { id } = question
  const form = formKeys.FACULTY_MONITORING

  return (
    <>
      <div className="info-container">
        <h4>{t('facultyTracking:formInfoHeader')}</h4>
        <p>{t('facultyTracking:formInfo1')}</p>
        <p>{t('facultyTracking:formInfo2')}</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="big-circle-red" />
          {t('facultyTracking:red')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="big-circle-yellow" />
          {t('facultyTracking:yellow')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="big-circle-green" />
          {t('facultyTracking:green')}
        </div>
        <br />
        <p>{t('facultyTracking:formInfo3')}</p>
      </div>
      <Form>
        <TrackingRadioButton id={id} form={form} />
        <TrackingTrafficLight id={id} form={form} />
        <FormGroup widths="equal">
          <MonitoringTextarea
            id={`${id}_actions`}
            label={t('formView:facultyActionsLabel')}
            form={form}
            className="textarea"
            maxLength={1500}
          />
        </FormGroup>
        <FormGroup widths="equal">
          <MonitoringTextarea
            id={`${id}_responsible_entities`}
            label={t('formView:facultyEntitiesLabel')}
            form={form}
            maxLength={150}
          />
        </FormGroup>
        <FormGroup widths="equal">
          <MonitoringTextarea
            id={`${id}_contact_person`}
            label={t('formView:facultyContactLabel')}
            required
            form={form}
            maxLength={100}
          />
          <MonitoringTextarea
            id={`${id}_resources`}
            label={t('formView:facultyResourcesLabel')}
            form={form}
            maxLength={100}
          />
        </FormGroup>
        <FormGroup widths="equal">
          <DatePickerField id={`${id}_start_date`} label={t('formView:facultyStartLabel')} form={form} />
          <DatePickerField id={`${id}_end_date`} label={t('formView:facultyEndLabel')} form={form} />
        </FormGroup>
      </Form>
    </>
  )
}

export default MonitoringQuestionForm
