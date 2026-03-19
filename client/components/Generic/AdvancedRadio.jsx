/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState, useEffect } from 'react'
import { Divider, Radio, Form, Input } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField, updateFormFieldExp, postIndividualFormPartialAnswer } from '../../redux/formReducer'
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
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const choose = (name, id) => {
    if (form === formKeys.DEGREE_REFORM_INDIVIDUALS) {
      dispatch(updateFormFieldExp(name, id, form))
      dispatch(postIndividualFormPartialAnswer({ field: name, value: id }))
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

  const handleOtherField = ({ input, level }) => {
    const { value } = input.target

    if (level === formKeys.DEGREE_REFORM_PROGRAMMES) {
      setState({ ...state, secondValue: state.secondValue, thirdValue: value })
    } else if (level === formKeys.YEARLY_ASSESSMENT) {
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
                    onChange={() => handleClick({ firstPart: o.id, value: '' })}
                    value={o.label}
                  />
                </Form.Field>
                {o.id === 'teaching_or_other_research' && state.firstValue === 'teaching_or_other_research' ? (
                  <>
                    <BasicRadio
                      checked={state}
                      disabled={viewOnly}
                      handleClick={handleClick}
                      handleOtherField={handleOtherField}
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
            <DropdownFilter
              disabled={viewOnly}
              handleFilterChange={handleClick}
              selectedRadio={state}
              size="small"
              version={version}
            />
          ) : null}
          {state.firstValue === 'other' ? (
            <Input
              disabled={viewOnly}
              onChange={value => handleOtherField({ input: value, level: 1 })}
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
