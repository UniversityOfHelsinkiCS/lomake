import React, { useState, useEffect } from 'react'
import { Divider, Radio, Form } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import { colors } from 'Utilities/common'
import { useTranslation } from 'react-i18next'
import FacultyFilter from './FacultyFilter'

import './Generic.scss'

const mapColorToValid = {
  VIHREÄ: 'green',
  KELTAINEN: 'yellow',
  PUNAINEN: 'red',
}

const AdvancedRadio = ({ id, label, description, required, number, previousYearsAnswers, extrainfo, radioOptions }) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({ value: '' })
  const dataFromRedux = useSelector(({ form }) => form.data[id] || '')
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()
  const filters = useSelector(state => state.filters.faculty)
  const choose = (name, id) => dispatch(updateFormField(name, id))

  let previousAnswerColor = previousYearsAnswers ? previousYearsAnswers[`${id}_light`] : null
  if (['VIHREÄ', 'KELTAINEN', 'PUNAINEN'].indexOf(previousAnswerColor) !== -1) {
    previousAnswerColor = mapColorToValid[previousAnswerColor]
  }
  const generateKey = label => {
    return `${label}_${new Date().getTime()}`
  }

  const handleClick = label => {
    setState({ value: label })
    if (label === 'faculty' && filters !== 'allFaculties') {
      choose(id, `faculty-${filters}`)
    } else {
      choose(id, label)
    }
  }

  useEffect(() => {
    setState({ value: dataFromRedux })
  }, [dataFromRedux])
  const radioButtonLabels = radioOptions ? radioOptions[lang] : null

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
      {radioButtonLabels ? (
        <Form>
          {radioButtonLabels.map(o => {
            const indexOfine = state.value.indexOf('-') === -1 ? state.value.length : 7
            const selected = state.value.substring(0, indexOfine)
            return (
              <Form.Field key={generateKey(o.label)}>
                <Radio
                  label={o.label}
                  name="radioGroup"
                  value={o.label}
                  checked={selected === o.id}
                  onChange={() => handleClick(o.id)}
                />
              </Form.Field>
            )
          })}
          {state.value.substring(0, 7) === 'faculty' ? (
            <FacultyFilter
              handleFilterChange={handleClick}
              version="degree-reform"
              size="small"
              label={t('comparison:filterFaculties')}
            />
          ) : null}
        </Form>
      ) : (
        <p>Missing options</p>
      )}
    </div>
  )
}

export default AdvancedRadio
