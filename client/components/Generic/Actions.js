import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Confirm, Divider, Input, Label, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { colors } from 'Utilities/common'
import SimpleTextarea from './SimpleTextarea'
// import Textarea from './Textarea'
import './Generic.scss'

const ActionElement = ({ t, id, form, viewOnly, index }) => {
  return (
    <div key={index}>
      <div style={{ paddingLeft: '2em' }}>
        <Label color="red" ribbon>
          {t('formView:developmentArea')}
        </Label>
        <Input style={{ width: '50%' }} placeholder={t('formView:developmentArea')} />
      </div>
      <SimpleTextarea label={t('formView:actions')} id={`${id}_${index}`} viewOnly={viewOnly} form={form} />
    </div>
  )
}

const Actions = ({ id, label, description, form, required, extrainfo }) => {
  const { t } = useTranslation()
  // const formData = useSelector(state => state.form.data)
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const [confirm, setConfirm] = useState(false)
  const [actions, setActions] = useState([{ id: 1, area_title: '', action_text: '' }])
  const actionCount = actions.length || 0

  const handleAdd = () => {
    setActions([...actions, { id: actionCount + 1, area_title: '', action_text: '' }])
  }

  const handleRemove = () => {
    const newList = actions.reduce((all, current) => {
      if (current?.id !== actionCount) {
        return [...all, current]
      }
      return all
    }, [])
    setActions(newList)
    setConfirm(false)
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
      {actions.map((action, index) => {
        return (
          <ActionElement
            key={action.id}
            t={t}
            id={id}
            form={form}
            viewOnly={viewOnly}
            action={action}
            index={index}
            actions={actions}
            setActions={setActions}
          />
        )
      })}
      <div style={{ display: 'flex' }}>
        {actionCount < 5 && (
          <Button icon basic labelPosition="left" color="blue" onClick={handleAdd}>
            <Icon name="add" />
            {t('formView:addDevelopmentArea')}
          </Button>
        )}
        {actionCount > 0 && (
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
