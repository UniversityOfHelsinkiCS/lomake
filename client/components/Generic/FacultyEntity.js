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
        id={`${id}_answer_1`}
        label={`${t('formView:facultyAnswerLabel1')}`}
        form={form}
        kludge={kludge}
        marginTop="0"
      />
      <br />
      <Textarea
        id={`${id}_answer_2`}
        label={`${t('formView:facultyAnswerLabel2')}`}
        form={form}
        kludge={kludge}
        marginTop="0"
      />
      <br />
      <Textarea
        id={`${id}_answer_3`}
        label={`${t('formView:facultyAnswerLabel3')}`}
        form={form}
        kludge={kludge}
        marginTop="0"
      />
      <br />
      <Textarea
        id={`${id}_answer_4`}
        label={`${t('formView:facultyAnswerLabel4')}`}
        form={form}
        kludge={kludge}
        marginTop="0"
      />
      <br />
      <Textarea
        id={`${id}_answer_5`}
        label={`${t('formView:facultyAnswerLabel5')}`}
        form={form}
        kludge={kludge}
        marginTop="0"
      />
    </div>
  )
}

export default FacultyEntity
