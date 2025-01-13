/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from '../../util/redux/formReducer'
import { FormInput, FormTextArea } from 'semantic-ui-react'
import './Generic.scss'

const MonitoringTextarea = ({ label, id, form, className = 'input', maxLength }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const handleChange = ({ target }) => dispatch(updateFormField(target.id, target.value, form))
  const dataFromRedux = useSelector(({ form }) => form.data[fieldName] || '')
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const [editorState, setEditorState] = useState(dataFromRedux)

  useEffect(() => {
    setEditorState(dataFromRedux)
  }, [dataFromRedux])

  if (viewOnly && (!editorState || !editorState.trim().length)) return null // Don't render non-existing measures

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '0px 6px' }}>
      {viewOnly ? (
        <span>{editorState}</span>
      ) : className === 'textarea' ? (
        <FormTextArea
          label={<label style={{ fontSize: 'inherit' }}>{label}</label>}
          id={fieldName}
          value={editorState}
          onChange={handleChange}
          style={{ minHeight: 100, width: '100%' }}
          maxLength={maxLength}
        />
      ) : (
        <FormInput
          label={<label style={{ fontSize: 'inherit' }}>{label}</label>}
          id={fieldName}
          value={editorState}
          onChange={handleChange}
          maxLength={maxLength}
          style={{ width: '100%' }}
        />
      )}
      <p style={{ color: 'gray', marginTop: '4px', alignSelf: 'flex-end' }}>
        {editorState.length}/{maxLength}
      </p>
    </div>
  )
}
export default MonitoringTextarea
