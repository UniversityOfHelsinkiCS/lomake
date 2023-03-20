import React, { useState, useEffect } from 'react'
import { Divider, Checkbox } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import { setAnswerLevels } from 'Utilities/redux/filterReducer'

import { colors } from 'Utilities/common'
import './Generic.scss'

const CustomCheckbox = ({ id, label, description, required, number, extrainfo, radioOptions }) => {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const dataFromRedux = useSelector(({ form }) => form.data[id] || '')
  const choose = (name, id) => dispatch(updateFormField(name, id))
  const options = radioOptions ? radioOptions[lang] : null

  const defaultValues = radioOptions.fi.map(o => ({ id: o.id, value: false }))
  const [values, setValue] = useState(defaultValues)

  useEffect(() => {
    if (dataFromRedux.length > 0) {
      setValue(dataFromRedux)
      if (id === 'view-is-based-on') {
        dispatch(setAnswerLevels(dataFromRedux))
      }
    }
  }, [dataFromRedux])

  const handleClick = eventValue => {
    let newValues = []
    if (eventValue === 'all') {
      if (values[3].value === false) {
        newValues = values.map(v => {
          v.value = true
          return v
        })
      } else {
        newValues = values.map(v => {
          v.value = false
          return v
        })
      }
    } else {
      newValues = values.map(v => {
        if (v.id === eventValue) {
          v.value = !v.value
          return v
        }
        return v
      })
    }
    setValue(newValues)
    choose(id, newValues)
    if (id === 'view-is-based-on') {
      dispatch(setAnswerLevels(newValues))
    }
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
      {description?.length > 0 ? (
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
          const checked = !!values.find(v => v.id === o.id && v.value)
          return (
            <Checkbox
              style={{ marginTop: '1em' }}
              checked={checked}
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
