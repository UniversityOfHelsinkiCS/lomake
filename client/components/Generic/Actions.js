import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { updateFormField } from 'Utilities/redux/formReducer'
import { colors } from 'Utilities/common'
import ActionElement from './ActionElement'
import './Generic.scss'

const Actions = ({ id, label, description, form, required, extrainfo }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const formData = useSelector(state => state.form.data)
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const actionsList = Object.keys(formData).filter(questionId => questionId.includes(id)) || []
  const actionsCount = actionsList.length

  const handleAdd = () => {
    dispatch(updateFormField(`${id}-${actionsCount + 1}-text`, { title: '', actions: '' }, form))
  }

  const previousHasContent = () => {
    if (!formData[`${id}-${actionsCount}-text`]) {
      return false
    }
    const latest = formData[`${id}-${actionsCount}-text`]
    return latest.title.length > 0 || latest.actions.length > 0
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
      {actionsList.length === 0 ? (
        <ActionElement key="action-1" id={id} form={form} viewOnly={viewOnly} index={1} />
      ) : (
        actionsList.map((action, index) => {
          return <ActionElement key={`action-${index + 1}`} id={id} form={form} viewOnly={viewOnly} index={index + 1} />
        })
      )}
      <div style={{ display: 'flex' }}>
        {actionsCount < 5 && !viewOnly && (
          <Button icon basic labelPosition="left" color="blue" onClick={handleAdd} disabled={!previousHasContent()}>
            <Icon name="add" />
            {t('formView:addDevelopmentArea')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Actions
