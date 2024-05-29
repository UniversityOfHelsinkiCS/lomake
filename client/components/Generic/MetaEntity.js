import React from 'react'
import { Divider } from 'semantic-ui-react'
import Textarea from './Textarea'

const MetaEntity = ({ label, id, form, actions, description }) => {
  return (
    <div>
      <Divider />
      <h3>{label}</h3>
      <div>Toimenpide-ehdotukset:</div>
      <ol>
        {actions.map(action => (
          <li key={action}>{action}</li>
        ))}
      </ol>
      <Textarea id={id} label={description} form={form} kludge={false} />
    </div>
  )
}

export default MetaEntity
