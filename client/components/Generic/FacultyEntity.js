import React from 'react'
import { colors } from 'Utilities/common'
import { useTranslation } from 'react-i18next'
import Textarea from './Textarea'
import TrafficLights from './TrafficLights'
import './Generic.scss'

const FacultyEntity = ({ id, label, required, number, form, kludge }) => {
  const { t } = useTranslation()

  return (
    <div className="form-entity-area" style={{ marginBottom: '3.5em' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ flexBasis: '75%' }}>
          <h3>
            {number}. {label}{' '}
            {required && (
              <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600', maxWidth: '' }}>*</span>
            )}
          </h3>
        </div>
        <TrafficLights id={id} form={form} />
      </div>
      <Textarea
        id={`${id}_actions`}
        label={`${t('formView:facultyActionsLabel')}`}
        form={form}
        kludge={kludge}
        marginTop="0"
      />
      <br />
      <Textarea
        id={`${id}_responsible_entities`}
        label={`${t('formView:facultyEntitiesLabel')}`}
        form={form}
        kludge={kludge}
        marginTop="0"
      />
      <br />
      <Textarea
        id={`${id}_contact_person`}
        label={`${t('formView:facultyContactLabel')}`}
        form={form}
        kludge={kludge}
        marginTop="0"
      />
      <br />
      <Textarea
        id={`${id}_resources`}
        label={`${t('formView:facultyResourcesLabel')}`}
        form={form}
        kludge={kludge}
        marginTop="0"
      />
      <br />
      <Textarea
        id={`${id}_schedule`}
        label={`${t('formView:facultyScheduleLabel')}`}
        form={form}
        kludge={kludge}
        marginTop="0"
      />
    </div>
  )
}

export default FacultyEntity
