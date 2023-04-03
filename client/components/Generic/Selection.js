import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox, Divider } from 'semantic-ui-react'
import { colors } from 'Utilities/common'
import { updateFormField } from 'Utilities/redux/formReducer'
import './Generic.scss'

const Selection = ({ id, label, description, required, number, extrainfo, options, lang, form }) => {
  const dispatch = useDispatch()
  const fieldNameOptions = `${id}_selection`
  const fieldNameText = `${id}_text`
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const values = useSelector(({ form }) => form.data[fieldNameOptions])
  const selections = values ? JSON.parse(values) : null
  const otherText = useSelector(({ form }) => form.data[fieldNameText])
  const ids = Object.keys(options)

  const handleSelection = data => {
    const { id, checked } = data
    const updated = { ...selections }
    updated[id] = checked
    dispatch(updateFormField(fieldNameOptions, JSON.stringify(updated), form))
  }

  const handleOther = ({ target }) => dispatch(updateFormField(fieldNameText, target.value, form))
  // TO FIX: move to translations
  const t = {
    fi: {
      select: 'Valitkaa sopivat vaihtoehdot',
      other: 'Muu, mikä?',
      info: 'Kirjatkaa puuttuvat vaihtoehdot - Voitte kirjata useamman',
    },
    en: {
      select: 'Valitkaa sopivat vaihtoehdot',
      other: 'Muu, mikä?',
      info: 'Kirjatkaa puuttuvat vaihtoehdot - Voitte kirjata useamman',
    },
  }

  return (
    <>
      <Divider />
      <div className="selection-area">
        <h3>
          {number}. {label} {required && <span style={{ color: colors.red, marginLeft: '0.2em' }}>*</span>}
        </h3>
        <div className="selection-description">
          <p>{description}</p>
          <p className="form-question-extrainfo">{extrainfo}</p>
        </div>
        <h4>{t[lang].select}</h4>
        <div className="selection-group">
          {ids.map(optionId => {
            return (
              <Checkbox
                key={optionId}
                id={optionId}
                label={options[optionId][lang]}
                onChange={(e, data) => handleSelection(data)}
                checked={selections ? selections[optionId] : false}
                disabled={viewOnly}
              />
            )
          })}
          <div className="form-textarea">
            <label>{t[lang].other}</label>
            {viewOnly ? (
              <>{otherText || ''}</>
            ) : (
              <textarea id="other" value={otherText || ''} onChange={handleOther} placeholder={t[lang].info} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Selection
