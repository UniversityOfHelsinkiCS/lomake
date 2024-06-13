import React from 'react'
import { Divider } from 'semantic-ui-react'
import { colors } from 'Utilities/common'
import Textarea from './Textarea'
import TrafficLights from './TrafficLights'
import './Generic.scss'

const MetaEntity = ({ id, label, description, required, noColor, number, form, kludge }) => {
  return (
    <div className="form-entity-area">
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '1000px' }}>
          <h3>
            {number}. {label}{' '}
            {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
          </h3>
        </div>
        {!noColor && <TrafficLights id={id} form={form} />}
      </div>
      <Textarea id={id} label={description} form={form} kludge={kludge} />
      <Textarea id={`${id}_comment`} label="Kommentit" form={form} kludge={kludge} />
    </div>
  )
}

export default MetaEntity
