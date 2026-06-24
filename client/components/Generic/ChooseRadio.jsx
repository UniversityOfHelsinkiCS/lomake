import { useState, useEffect } from 'react'
import { Form } from 'semantic-ui-react'
import Divider from '@mui/material/Divider'
import { useSelector } from 'react-redux'
import { colors } from '../../util/common'
import BasicRadio from './BasicRadio'
import './Generic.scss'

const ChooseRadio = ({ id, label, description, required, extrainfo, radioOptions, direction, formType, hidePopup }) => {
  const [state, setState] = useState({ value: '' })
  const dataFromRedux = useSelector(({ form }) => form.data[id] ?? '')
  const lang = useSelector(state => state.language)
  const viewOnly = true

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
    <div className="form-choose-radio-area" data-cy={`choose-radio-container-${id}`} key={`${id}-${formType}-${lang}`}>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>
            {label}{' '}
            {required ? <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span> : null}
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
          checked={state.value}
          direction={direction}
          handleClick={() => null}
          hidePopup={hidePopupTrue}
          id={id}
          radioButtonLabels={radioButtonLabels}
          type="choose"
          viewOnly={viewOnly}
        />
      </Form>
    </div>
  )
}

export default ChooseRadio
