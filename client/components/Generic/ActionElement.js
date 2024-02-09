import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextArea, Label } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { updateFormField } from 'Utilities/redux/formReducer'
import './Generic.scss'
import { formKeys } from '@root/config/data'

const ActionElement = ({ id, form, viewOnly, index }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const fieldName = `${id}-${index}-text`
  const actionPoint = useSelector(({ form }) => form.data[fieldName] || { title: '', actions: '' })
  const { title, actions } = actionPoint

  const handleChange = ({ target }) => {
    const { id, value } = target
    const updated = { ...actionPoint, [id]: value }
    dispatch(updateFormField(fieldName, updated, form))
  }

  return (
    <div key={index}>
      <div style={{ paddingLeft: '2em' }}>
        <Label color="red" ribbon style={{ top: '-2em' }}>
          {t('formView:developmentArea')}
        </Label>
        <TextArea
          id="title"
          style={{ width: '50%' }}
          rows={2}
          placeholder={t('formView:developmentArea')}
          onChange={handleChange}
          disabled={viewOnly}
          value={title || ''}
        />
      </div>
      <div className="form-textarea">
        <label>{t(form === formKeys.EVALUATION_PROGRAMMES ? 'formView:actions' : 'formView:requiredActions')}</label>
        {viewOnly ? actions : <textarea id="actions" value={actions || ''} onChange={handleChange} />}
      </div>
    </div>
  )
}

export default ActionElement
