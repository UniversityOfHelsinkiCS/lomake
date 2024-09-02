import React, { useState } from 'react'
import { Form, FormButton, FormInput, FormTextArea, FormGroup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const MonitoringQuestionForm = ({ question }) => {
  const { t } = useTranslation()
  const { id } = question.id

  const [formValues, setFormValues] = useState({
    [`${id}_actions`]: '',
    [`${id}_responsible_entities`]: '',
    [`${id}_contact_person`]: '',
    [`${id}_resources`]: '',
    [`${id}_schedule`]: '',
  })

  const handleChange = (e, { name, value }) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    console.log(formValues)
    // todo: save answers to db
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup widths="equal">
        <FormTextArea
          id={`${id}_actions`}
          label={t('formView:facultyActionsLabel')}
          value={formValues[`${id}_actions`]}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup widths="equal">
        <FormInput
          id={`${id}_responsible_entities`}
          label={t('formView:facultyEntitiesLabel')}
          value={formValues[`${id}_responsible_entities`]}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup widths="equal">
        <FormInput
          id={`${id}_contact_person`}
          label={t('formView:facultyContactLabel')}
          value={formValues[`${id}_contact_person`]}
          onChange={handleChange}
        />
        <FormInput
          id={`${id}_resources`}
          label={t('formView:facultyResourcesLabel')}
          value={formValues[`${id}_resources`]}
          onChange={handleChange}
        />
      </FormGroup>
      <FormInput
        id={`${id}_schedule`}
        label={t('formView:facultyScheduleLabel')}
        value={formValues[`${id}_schedule`]}
        onChange={handleChange}
        width={8}
      />
      <div style={{ textAlign: 'right' }}>
        <FormButton secondary type="submit">
          {t('formView:sendForm')}
        </FormButton>
      </div>
    </Form>
  )
}

export default MonitoringQuestionForm
