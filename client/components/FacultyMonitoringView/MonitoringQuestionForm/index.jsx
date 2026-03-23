import { useState } from 'react'
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
        <TrackingTrafficLight form={form} id={id} />
        <TrackingRadioButton form={form} id={id} />
        <FormGroup style={{ marginTop: '28px' }} widths="equal">
          <MonitoringTextarea
            className="textarea"
            form={form}
            id={`${id}_actions`}
            label={t('formView:facultyActionsLabel')}
            maxLength={1500}
          />
        </FormGroup>
        <FormGroup widths="equal">
          <MonitoringTextarea
            form={form}
            id={`${id}_responsible_entities`}
            label={t('formView:facultyEntitiesLabel')}
            maxLength={150}
          />
        </FormGroup>
        <FormGroup widths="equal">
          <MonitoringTextarea
            form={form}
            id={`${id}_contact_person`}
            label={t('formView:facultyContactLabel')}
            maxLength={100}
            required
          />
          <MonitoringTextarea
            form={form}
            id={`${id}_resources`}
            label={t('formView:facultyResourcesLabel')}
            maxLength={100}
          />
        </FormGroup>
        {error ? <p style={{ color: 'red' }}>{t(error)}</p> : null}
        <FormGroup widths="equal">
          <DatePickerField error={error} form={form} id={id} setError={setError} />
        </FormGroup>
      </Form>
    </>
  )
}

export default MonitoringQuestionForm
