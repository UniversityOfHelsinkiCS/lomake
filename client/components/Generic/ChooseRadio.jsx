import React, { useState, useEffect } from 'react'
import { Divider, Form } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { updateFormField, updateFormFieldExp, postIndividualFormPartialAnswer } from '../../util/redux/formReducer'
import { colors, getForm } from '../../util/common'
import { formKeys } from '../../../config/data'
import BasicRadio from './BasicRadio'
import './Generic.scss'

const ChooseRadio = ({ id, label, description, required, extrainfo, radioOptions, direction, formType, hidePopup }) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({ value: '' })
  const dataFromRedux = useSelector(({ form }) => form.data[id] || '')
  const lang = useSelector(state => state.language)
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const form = getForm(formType)
  const choose = async (field, value) => {
    if (form === formKeys.DEGREE_REFORM_INDIVIDUALS3) {
      dispatch(updateFormFieldExp(field, value, form))
      dispatch(postIndividualFormPartialAnswer({ field, value }))
    } else {
      dispatch(updateFormField(field, value, form))
    }
  }

  const handleClick = label => {
    setState({ value: label })
    choose(id, label)
  }
  useEffect(() => {
    setState({ value: dataFromRedux })
  }, [dataFromRedux])

  let radioButtonLabels

  if (typeof radioOptions === 'string') {
    let idkButton
    if (lang === 'fi') {
      idkButton = 'En osaa sanoa'
    } else if (lang === 'se') {
      idkButton = 'Jag vet inte'
    } else {
      idkButton = "I don't know"
    }
    radioButtonLabels = [
      { id: 'first', label: 1 },
      { id: 'second', label: 2 },
      { id: 'third', label: 3 },
      { id: 'fourth', label: 4 },
      { id: 'fifth', label: 5 },
      { id: 'idk', label: idkButton },
    ]
  } else {
    radioButtonLabels = radioOptions ? radioOptions[lang] : null
  }
  const hidePopupTrue = hidePopup === true
  return (
    <div key={`${id}-${formType}-${lang}`} className="form-choose-radio-area" data-cy={`choose-radio-container-${id}`}>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>
            {label} {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
          </h3>
        </div>
      </div>
      {description?.length > 1 ? (
        <div className="choose-radio-description">
          {description}
          <p className="form-question-extrainfo">{extrainfo}</p>
        </div>
      ) : (
        <div style={{ height: '1em' }} />
      )}
      <Form disabled={viewOnly}>
        <BasicRadio
          id={id}
          direction={direction}
          handleClick={handleClick}
          checked={state.value}
          viewOnly={viewOnly}
          radioButtonLabels={radioButtonLabels}
          hidePopup={hidePopupTrue}
          type="choose"
        />
      </Form>
    </div>
  )
}

export default ChooseRadio
