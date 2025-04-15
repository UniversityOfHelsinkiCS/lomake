import React from 'react'
import { useSelector } from 'react-redux'
import { colors } from '../../util/common'
import { useTranslation } from 'react-i18next'
import Textarea from './Textarea'
import MetaTrafficLights from './MetaTrafficLights'
import './Generic.scss'

const MetaEntity = ({ id, label, description, required, noColor, number, form, kludge }) => {
  const fieldName = `${id}_light`
  const { t } = useTranslation()
  const value = useSelector(({ form }) => form.data[fieldName])
  const bool = value !== 'gray'

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
        {!noColor && <MetaTrafficLights id={id} form={form} />}
      </div>
      {bool && <Textarea id={id} label={description} form={form} kludge={kludge} marginTop="0" />}
      <br />
      <Textarea
        id={`${id}_comment`}
        label={`${t('formView:metaCommentLabel')}`}
        form={form}
        kludge={kludge}
        marginTop="0"
      />
    </div>
  )
}

export default MetaEntity
