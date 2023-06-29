import React from 'react'
import { Radio, Form, Input } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import './Generic.scss'

const BasicRadio = ({ id, radioButtonLabels, direction, handleClick, viewOnly, type, checked, handleOtherField }) => {
  const { t } = useTranslation()

  const handleChange = label => {
    if (type === 'choose') {
      handleClick(label)
    } else {
      handleClick({ firstPart: checked.firstValue, secondPart: label })
    }
  }

  const isChecked = value => {
    return type === 'choose' ? checked === value : checked.secondValue === value
  }
  return (
    <div>
      {radioButtonLabels ? (
        <div data-cy={`${type}-basic-radio-${id}`} style={direction === 'horizontal' ? { display: 'flex' } : null}>
          {radioButtonLabels.map(o => {
            return (
              <Form.Field
                key={`basic-radio-${id}-${o.id}`}
                disabled={viewOnly}
                style={
                  direction !== 'horizontal'
                    ? { display: 'flex', marginBottom: '0.2em' }
                    : { marginLeft: '2em', textAlign: 'center' }
                }
              >
                <Radio
                  name="basic-radio"
                  style={{ display: 'flex', alignItems: 'center' }}
                  value={o.label}
                  disabled={viewOnly}
                  label={
                    <label
                      data-cy={`basic-radio-${o.id}`}
                      style={direction !== 'horizontal' ? { display: 'flex', marginLeft: '1.5em' } : null}
                    >
                      {o.label}
                    </label>
                  }
                  checked={isChecked(o.id)}
                  onClick={() => handleChange(o.id)}
                />
              </Form.Field>
            )
          })}
          {checked.secondValue === 'other' ? (
            <Form.Field>
              <Input
                data-cy={`${type}-basic-input-other-field`}
                disabled={viewOnly}
                style={{ width: '60%' }}
                value={checked.thirdValue}
                onChange={value => handleOtherField({ input: value, level: 2 })}
                version="degree-reform"
                size="small"
                placeholder={t('what')}
              />
            </Form.Field>
          ) : null}
        </div>
      ) : (
        <p>Missing options</p>
      )}
    </div>
  )
}

export default BasicRadio
