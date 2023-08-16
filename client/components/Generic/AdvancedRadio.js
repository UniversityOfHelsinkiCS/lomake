import React, { useState, useEffect } from 'react'
import { Divider, Radio, Form, Input } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import { getForm } from 'Utilities/common'
import { useTranslation } from 'react-i18next'
import useDebounce from 'Utilities/useDebounce'
import DropdownFilter from './DropdownFilter'
import BasicRadio from './BasicRadio'

import './Generic.scss'

const AdvancedRadio = ({ id, label, description, required, extrainfo, radioOptions, formType, advancedOptions }) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({ firstValue: '', secondValue: '', thirdValue: '' })
  const dataFromRedux = useSelector(({ form }) => form.data[id] || '')
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()
  const form = getForm(formType)
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const choose = (name, id) => dispatch(updateFormField(name, id, form))
  const debouncedFilter = useDebounce(state, 200)

  const saveState = () => {
    if (debouncedFilter.thirdValue) {
      choose(id, `${debouncedFilter.firstValue}_-_${debouncedFilter.secondValue}_-_${debouncedFilter.thirdValue}`)
    } else if (debouncedFilter.secondValue) {
      choose(id, `${debouncedFilter.firstValue}_-_${debouncedFilter.secondValue}`)
    } else if (debouncedFilter.firstValue) {
      choose(id, `${debouncedFilter.firstValue}`)
    }
  }

  useEffect(() => {
    const splitRadio = dataFromRedux.split('_-_')

    for (let i = 0; i < 3; i++) {
      if (!splitRadio[i]) {
        splitRadio[i] = ''
      }
    }
    setState({ firstValue: splitRadio[0], secondValue: splitRadio[1], thirdValue: splitRadio[2] })
  }, [dataFromRedux])

  useEffect(() => {
    saveState()
  }, [debouncedFilter])

  const handleOtherField = ({ input, level }) => {
    const { value } = input.target

    if (level === 2) {
      setState({ ...state, secondValue: state.secondValue, thirdValue: value })
    } else if (level === 1) {
      setState({ firstValue: state.firstValue, secondValue: value, thirdValue: null })
    }
  }

  const handleClick = ({ firstPart, secondPart, thirdPart }) => {
    if (thirdPart) {
      setState({ firstValue: firstPart, secondValue: secondPart, thirdValue: thirdPart })
      choose(id, `${firstPart}_-_${secondPart}_-_${thirdPart}`)
    } else if (secondPart) {
      setState({ ...state, firstValue: firstPart, secondValue: secondPart })
      choose(id, `${firstPart}_-_${secondPart}`)
    } else {
      setState({ ...state, firstValue: firstPart })
      choose(id, firstPart)
    }
  }

  const radioButtonLabels = radioOptions ? radioOptions[lang] : null
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
      {description.length > 1 ? (
        <div className="advanced-radio-description">
          {description}
          <p className="form-question-extrainfo">{extrainfo}</p>
        </div>
      ) : (
        <div style={{ height: '1em' }} />
      )}
      {radioButtonLabels ? (
        <Form key={`advanced-radio-${id}`} data-cy={`advanced-radio-${id}`} disabled={viewOnly}>
          {radioButtonLabels.map(o => {
            return (
              <div key={`${id}-${o.id}`}>
                <Form.Field>
                  <Radio
                    disabled={viewOnly}
                    label={o.label}
                    name="radioGroup"
                    value={o.label}
                    checked={state.firstValue === o.id}
                    onChange={() => handleClick({ firstPart: o.id, value: '' })}
                    data-cy="unit-selection"
                  />
                </Form.Field>
                {o.id === 'teaching_or_other_research' && state.firstValue === 'teaching_or_other_research' ? (
                  <>
                    <BasicRadio
                      handleClick={handleClick}
                      checked={state}
                      disabled={viewOnly}
                      id={id}
                      type="advanced"
                      radioButtonLabels={advancedOptions[o.id][lang]}
                      handleOtherField={handleOtherField}
                    />
                    <div style={{ marginBottom: '1em' }} />
                  </>
                ) : null}
              </div>
            )
          })}
          {state.firstValue === 'faculty' || state.firstValue === 'specific-programme' ? (
            <DropdownFilter
              handleFilterChange={handleClick}
              version={state.firstValue}
              size="small"
              selectedRadio={state}
              disabled={viewOnly}
            />
          ) : null}
          {state.firstValue === 'other' ? (
            <Input
              style={{ width: '60%' }}
              value={state.secondValue}
              onChange={value => handleOtherField({ input: value, level: 1 })}
              version="degree-reform"
              size="small"
              disabled={viewOnly}
              placeholder={t('what')}
            />
          ) : null}
        </Form>
      ) : (
        <p>Missing options</p>
      )}
      {}
    </div>
  )
}

export default AdvancedRadio
