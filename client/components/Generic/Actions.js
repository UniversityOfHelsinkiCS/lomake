import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Confirm, Divider, Input, Label, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { updateFormField } from 'Utilities/redux/formReducer'
import { colors } from 'Utilities/common'
import './Generic.scss'

const ActionElement = ({ id, form, viewOnly, index }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const fieldName = `${id}-${index}-text`

  const actionPoint = useSelector(({ form }) => form.data[fieldName] || { title: '', actions: '' })
  const { title, actions } = actionPoint

  const handleChange = ({ target }) => {
    const { id, value } = target
    // console.log(target.id, target.value)
    const updated = { ...actionPoint, [id]: value }
    // console.log(updated)
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
        <label>{t('formView:actions')}</label>
        {viewOnly ? <>{actions}</> : <textarea id="actions" value={actions || ''} onChange={handleChange} />}
      </div>
    </div>
  )
}

const Actions = ({ id, label, description, form, required, extrainfo }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const formData = useSelector(state => state.form.data)
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const [confirm, setConfirm] = useState(false)

  const actionsList = Object.keys(formData).filter(questionId => questionId.includes(id)) || []
  const actionsCount = actionsList.length

  // console.log(actionsList)

  const handleAdd = () => {
    dispatch(updateFormField(`${id}-${actionsCount + 1}-text`, { title: '', actions: '' }, form))
  }

  const handleRemove = () => {
    // const newList = actions.reduce((all, current) => {
    //   if (current?.id !== actionCount) {
    //     return [...all, current]
    //   }
    //   return all
    // }, [])
    // setActions(newList)
    // setConfirm(false)
  }

  return (
    <div
      className="form-entity-area"
      style={{
        borderLeft: '5px solid',
        borderColor: colors.background_black,
        padding: '1em',
      }}
    >
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '500px' }}>
          <h3>
            {label} {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
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
      {actionsList.map((action, index) => {
        return <ActionElement key={`action-${index + 1}`} id={id} form={form} viewOnly={viewOnly} index={index + 1} />
      })}
      <div style={{ display: 'flex' }}>
        {actionsCount < 5 && !viewOnly && (
          <Button icon basic labelPosition="left" color="blue" onClick={handleAdd}>
            <Icon name="add" />
            {t('formView:addDevelopmentArea')}
          </Button>
        )}
        {actionsCount > 0 && !viewOnly && (
          <div>
            <Button icon basic labelPosition="left" color="red" onClick={() => setConfirm(true)}>
              <Icon name="trash alternate" />
              {t('formView:removeDevelopmentArea')}
            </Button>
            <Confirm open={confirm} onCancel={() => setConfirm(false)} onConfirm={handleRemove} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Actions
