import React, { useState, useEffect } from 'react'
import { Divider, Radio, Form, Input } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import { getForm } from 'Utilities/common'
import { useTranslation } from 'react-i18next'
import DropdownFilter from './DropdownFilter'

import './Generic.scss'

const AdvancedRadio = ({ id, label, description, required, extrainfo, radioOptions, formType }) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({ value: '' })
  const dataFromRedux = useSelector(({ form }) => form.data[id] || '')
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()
  const form = getForm(formType)
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const choose = (name, id) => dispatch(updateFormField(name, id, form))

  const generateKey = label => {
    return `${label}_${new Date().getTime()}`
  }

  const handleClick = (firstPart, secondPart) => {
    if (firstPart && !secondPart) {
      setState({ value: `${firstPart}` })
      choose(id, firstPart)
    } else {
      setState({ value: `${firstPart}-${secondPart}` })
      choose(id, `${firstPart}-${secondPart}`)
    }
  }

  useEffect(() => {
    setState({ value: dataFromRedux })
  }, [dataFromRedux])
  const radioButtonLabels = radioOptions ? radioOptions[lang] : null

  const indexOfine = state.value.indexOf('-') === -1 ? state.value.length : 7
  const selected = state.value.substring(0, indexOfine)

  return (
    <div className="form-advanced-radio-area">
      <Divider />
      <div className="question-title">
        <div style={{ maxWidth: '750px' }}>
          <h3>
            {label} {required && <span className="question-required">*</span>}
          </h3>
        </div>
      </div>
      <div className="advanced-radio-description">
        {description}
        <p className="form-question-extrainfo">{extrainfo}</p>
      </div>
      {radioButtonLabels ? (
        <Form>
          {radioButtonLabels.map(o => {
            return (
              <Form.Field key={generateKey(o.label)}>
                <Radio
                  disabled={viewOnly}
                  label={o.label}
                  name="radioGroup"
                  value={o.label}
                  checked={selected === o.id}
                  onChange={() => handleClick(o.id, '')}
                  data-cy="unit-selection"
                />
              </Form.Field>
            )
          })}
          {selected === 'faculty' ? (
            <DropdownFilter
              handleFilterChange={handleClick}
              version="degree-reform"
              size="small"
              label={t('comparison:filterFaculties')}
              selectedRadio={state.value}
              disabled={viewOnly}
            />
          ) : null}
          {selected === 'other' ? <Input handleFilterChange={handleClick} version="degree-reform" size="big" /> : null}
        </Form>
      ) : (
        <p>Missing options</p>
      )}
    </div>
  )
}

export default AdvancedRadio
