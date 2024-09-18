/* eslint-disable no-nested-ternary */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import { FormInput, FormTextArea } from 'semantic-ui-react'
import './Generic.scss'

const MonitoringTextarea = ({ label, id, form, className = 'input' }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const handleChange = ({ target }) => dispatch(updateFormField(target.id, target.value, form))
  const value = useSelector(({ form }) => form.data[fieldName] || '')
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  if (viewOnly && (!value || !value.trim().length)) return null // Don't render non-existing measures

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {viewOnly ? (
        <span>{value}</span>
      ) : className === 'textarea' ? (
        <FormTextArea label={label} id={fieldName} value={value} onChange={handleChange} />
      ) : (
        <FormInput label={label} id={fieldName} value={value} onChange={handleChange} />
      )}
    </>
  )
}
export default MonitoringTextarea
