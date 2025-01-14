import React, { useState } from 'react'
import { Form, FormGroup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { formKeys } from '../../../../config/data'
import MonitoringTextarea from '../../Generic/MonitoringTextarea'
import TrackingTrafficLight from '../../Generic/TrackingTrafficLight'
import DatePickerField from '../../Generic/DatePickerField'
import TrackingRadioButton from '../../Generic/TrackingRadioButton'

const MonitoringQuestionForm = ({ question }) => {
  const { t } = useTranslation()
  const { id } = question
  const form = formKeys.FACULTY_MONITORING
  const [error, setError] = useState(null)

  return (
    <>
      <div className="info-container" style={{ marginBottom: '24px' }}>
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
        <TrackingTrafficLight id={id} form={form} />
        <TrackingRadioButton id={id} form={form} />
        <FormGroup widths="equal" style={{ marginTop: '28px' }}>
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
        {error && <p style={{ color: 'red' }}>{t(error)}</p>}
        <FormGroup widths="equal">
          <DatePickerField id={id} form={form} error={error} setError={setError} />
        </FormGroup>
      </Form>
    </>
  )
}

export default MonitoringQuestionForm
