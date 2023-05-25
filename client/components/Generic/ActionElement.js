import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Label } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { updateFormField } from 'Utilities/redux/formReducer'
import './Generic.scss'

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
        <Label color="red" ribbon>
          {t('formView:developmentArea')}
        </Label>
        <Input
          id="title"
          style={{ width: '50%' }}
          placeholder={t('formView:developmentArea')}
          onChange={handleChange}
          disabled={viewOnly}
          value={title || ''}
        />
      </div>
      <div className="form-textarea">
        <label>{t(form === 4 ? 'formView:actions' : 'formView:requiredActions')}</label>
        {viewOnly ? <>{actions}</> : <textarea id="actions" value={actions || ''} onChange={handleChange} />}
      </div>
    </div>
  )
}

export default ActionElement
