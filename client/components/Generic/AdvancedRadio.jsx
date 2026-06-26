/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react'
import { Radio, Form, Input } from 'semantic-ui-react'
import Divider from '@mui/material/Divider'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField, updateFormFieldExp } from '../../redux/formReducer'
import { getForm } from '../../util/common'
import { useTranslation } from 'react-i18next'
import useDebounce from '../../util/useDebounce'
import { formKeys } from '../../../config/data'
import DropdownFilter from './DropdownFilter'
import BasicRadio from './BasicRadio'

import './Generic.scss'

const AdvancedRadio = ({
  id,
  label,
  description,
  required,
  extrainfo,
  radioOptions,
  formType,
  advancedOptions,
  version,
}) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({ firstValue: '', secondValue: '', thirdValue: '' })
  const dataFromRedux = useSelector(({ form }) => form.data[id] || '')
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()
  const form = getForm(formType)
  const viewOnly = true

  const choose = (name, id) => {
    if (form === formKeys.DEGREE_REFORM_INDIVIDUALS) {
      dispatch(updateFormFieldExp(name, id, form))
    } else {
      dispatch(updateFormField(name, id, form))
    }
  }
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

  const radioButtonLabels = radioOptions ? radioOptions[lang] : null
  return (
    <div className="form-advanced-radio-area">
      <Divider />
      <div className="question-title">
        <div style={{ maxWidth: '750px' }}>
          <h3>
            {label} {required ? <span className="question-required">*</span> : null}
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
        <Form data-cy={`advanced-radio-${id}`} disabled={viewOnly} key={`advanced-radio-${id}`}>
          {radioButtonLabels.map(o => {
            return (
              <div key={`${id}-${o.id}`}>
                <Form.Field>
                  <Radio
                    checked={state.firstValue === o.id}
                    disabled={viewOnly}
                    label={o.label}
                    name="radioGroup"
                    value={o.label}
                  />
                </Form.Field>
                {o.id === 'teaching_or_other_research' && state.firstValue === 'teaching_or_other_research' ? (
                  <>
                    <BasicRadio
                      checked={state}
                      disabled={viewOnly}
                      handleOtherField={null}
                      id={id}
                      radioButtonLabels={advancedOptions[o.id][lang]}
                      type="advanced"
                    />
                    <div style={{ marginBottom: '1em' }} />
                  </>
                ) : null}
              </div>
            )
          })}
          {state.firstValue === 'faculty' || state.firstValue === 'specific-programme' ? (
            <DropdownFilter disabled={viewOnly} selectedRadio={state} size="small" version={version} />
          ) : null}
          {state.firstValue === 'other' ? (
            <Input
              disabled={viewOnly}
              placeholder={t('what')}
              size="small"
              style={{ width: '60%' }}
              value={state.secondValue}
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
