import React from 'react'
import { Radio, Form, Input, Popup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import './Generic.scss'

const BasicRadio = ({
  id,
  radioButtonLabels,
  direction,
  handleClick,
  viewOnly,
  type,
  checked,
  handleOtherField,
  hidePopup,
}) => {
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
            let toolTipText = ''
            if (o.id === 'first') {
              toolTipText = `${t('formView:stronglyDisagree')}`
            } else if (o.id === 'second') {
              toolTipText = `${t('formView:partiallyDisagree')}`
            } else if (o.id === 'third') {
              toolTipText = `${t('formView:neitherNor')}`
            } else if (o.id === 'fourth') {
              toolTipText = `${t('formView:partiallyAgree')}`
            } else if (o.id === 'fifth') {
              toolTipText = `${t('formView:stronglyAgree')}`
            } else if (o.id === 'idk') {
              toolTipText = t('formView:doNotKnow')
            }
            return (
              <React.Fragment key={o.id}>
                {!hidePopup ? (
                  <Popup
                    content={<p>{toolTipText}</p>}
                    popper={{ id: 'popper-container', style: { zIndex: 2000 } }}
                    position="bottom center"
                    trigger={
                      <Form.Field
                        disabled={viewOnly}
                        key={`basic-radio-${id}-${o.id}`}
                        style={
                          direction !== 'horizontal'
                            ? { display: 'flex', marginBottom: '0.2em' }
                            : { marginLeft: '2em', textAlign: 'center' }
                        }
                      >
                        <Radio
                          checked={isChecked(o.id)}
                          disabled={viewOnly}
                          label={
                            <label
                              data-cy={`basic-radio-${o.id}`}
                              style={direction !== 'horizontal' ? { display: 'flex', marginLeft: '1.5em' } : null}
                            >
                              {o.label}
                            </label>
                          }
                          name="basic-radio"
                          onClick={() => handleChange(o.id)}
                          style={{ display: 'flex', alignItems: 'center' }}
                          value={o.label}
                        />
                      </Form.Field>
                    }
                  />
                ) : (
                  <Form.Field
                    disabled={viewOnly}
                    key={`basic-radio-${id}-${o.id}`}
                    style={
                      direction !== 'horizontal'
                        ? { display: 'flex', marginBottom: '0.2em' }
                        : { marginLeft: '2em', textAlign: 'center' }
                    }
                  >
                    <Radio
                      checked={isChecked(o.id)}
                      disabled={viewOnly}
                      label={
                        <label
                          data-cy={`basic-radio-${o.id}`}
                          style={direction !== 'horizontal' ? { display: 'flex', marginLeft: '1.5em' } : null}
                        >
                          {o.label}
                        </label>
                      }
                      name="basic-radio"
                      onClick={() => handleChange(o.id)}
                      style={{ display: 'flex', alignItems: 'center' }}
                      value={o.label}
                    />
                  </Form.Field>
                )}
              </React.Fragment>
            )
          })}
          {checked.secondValue === 'other' ? (
            <Form.Field>
              <Input
                data-cy={`${type}-basic-input-other-field`}
                disabled={viewOnly}
                onChange={value => handleOtherField({ input: value, level: 2 })}
                placeholder={t('what')}
                size="small"
                style={{ width: '60%' }}
                value={checked.thirdValue}
                version="degree-reform"
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
