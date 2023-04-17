import React, { useState, useEffect } from 'react'
import { Divider } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { setAnswerLevels, updateFormField } from 'Utilities/redux/formReducer'
import { getFilters, getForm } from 'Utilities/common'
import './Generic.scss'

const CustomCheckbox = ({ id, label, description, required, extrainfo, radioOptions, formType }) => {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const dataFromRedux = useSelector(({ form }) => form.data[id] || '')
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const form = getForm(formType)
  const choose = (name, id) => dispatch(updateFormField(name, id, form))
  const options = radioOptions ? radioOptions[lang] : null

  const generateRandomKey = value => `${value}-${Math.random()}`
  const defaultValues = radioOptions.fi.map(o => ({ id: o.id, value: false }))
  const [values, setValue] = useState(defaultValues)

  useEffect(() => {
    if (dataFromRedux.length > 0) {
      setValue(dataFromRedux)
      if (id === 'view-is-based-on') {
        const filters = getFilters(dataFromRedux)
        dispatch(setAnswerLevels(filters))
      }
    }
  }, [dataFromRedux])

  const handleClick = eventValue => {
    let newValues = []

    newValues = values.map(v => {
      if (v.id === eventValue) {
        v.value = !v.value
        return v
      }
      return v
    })

    setValue(newValues)
    choose(id, newValues)
    if (id === 'view-is-based-on') {
      const filters = getFilters(newValues)
      dispatch(setAnswerLevels(filters))
    }
  }
  return (
    <div className="form-checkbox-area">
      <Divider />
      <div className="question-title">
        <div style={{ maxWidth: '750px' }}>
          <h3>
            {label} {required && <span className="question-required">*</span>}
          </h3>
        </div>
      </div>
      {description?.length > 0 ? (
        <div className="checkbox-description">
          {description}
          <p className="form-question-extrainfo">{extrainfo}</p>
        </div>
      ) : (
        <div style={{ height: '1em' }} />
      )}
      <div
        className="ui checked checkbox"
        data-cy={`choose-checkbox-${id}`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {options.map(o => {
          const checked = !!values.find(v => v.id === o.id && v.value)
          return (
            <div key={generateRandomKey(o.label)} style={{ marginTop: '1em' }}>
              <input
                className="checkbox-input"
                type="checkbox"
                data-cy={`choose-checkbox-${o.id}`}
                checked={checked}
                id={o.id}
                onChange={() => handleClick(o.id)}
                disabled={viewOnly}
                value={o.id}
              />
              <label data-cy="testing" htmlFor={o.id}>
                {o.label}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CustomCheckbox
