import React from 'react'
import { useSelector } from 'react-redux'
import { colors } from 'Utilities/common'
import Textarea from './Textarea'
import MetaTrafficLights from './MetaTrafficLights'
import './Generic.scss'

const MetaEntity = ({ id, label, description, required, noColor, number, form, kludge }) => {
  const fieldName = `${id}_light`
  const value = useSelector(({ form }) => form.data[fieldName])
  const bool = value !== 'gray'

  return (
    <div className="form-entity-area" style={{ marginBottom: 25 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 15,
        }}
      >
        <div style={{ maxWidth: '1000px' }}>
          <h3>
            {number}. {label}{' '}
            {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
          </h3>
        </div>
        {!noColor && <MetaTrafficLights id={id} form={form} />}
      </div>
      {bool && <Textarea id={id} label={description} form={form} kludge={kludge} />}
      <Textarea id={`${id}_comment`} label="Kommentit" form={form} kludge={kludge} />
    </div>
  )
}

export default MetaEntity
