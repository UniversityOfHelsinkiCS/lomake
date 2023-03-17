import React, { useState } from 'react'
import { Divider, Checkbox } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

import { colors } from 'Utilities/common'
import './Generic.scss'

const CustomCheckbox = ({ label, description, required, number, extrainfo, radioOptions }) => {
  const lang = useSelector(state => state.language)
  const [values, setValue] = useState(radioOptions.fi.map(o => ({ id: o.id, value: false })))

  const options = radioOptions ? radioOptions[lang] : null

  const handleClick = eventValue => {
    const newValues = values.map(v => {
      if (v.id === eventValue) {
        v.value = !v.value
        return v
      }
      return v
    })
    setValue(newValues)
  }

  return (
    <div className="form-entity-area">
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '500px' }}>
          <h3>
            {number}. {label}{' '}
            {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
          </h3>
        </div>
      </div>
      {description?.length > 1 ? (
        <div
          className="entity-description"
          style={{
            lineHeight: 2,
            backgroundColor: colors.background_beige,
            padding: '1em',
            borderRadius: '5px',
            margin: '1em 0',
          }}
        >
          {description}
          <p className="form-question-extrainfo">{extrainfo}</p>
        </div>
      ) : (
        <div style={{ height: '1em' }} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {options.map(o => {
          return (
            <Checkbox
              style={{ marginTop: '1em' }}
              checked={values.find(v => v.id === o.id && v.value)}
              id={o.id}
              label={o.label}
              onClick={() => handleClick(o.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default CustomCheckbox
