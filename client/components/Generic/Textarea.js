import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { requiredFormIds } from 'Utilities/common'
import { updateFormField } from 'Utilities/redux/formReducer'

const Textarea = ({ label, id }) => {
	const dispatch = useDispatch()
	const fieldName = `${id}_text`
	const handleChange = ({ target }) => dispatch(updateFormField(target.id, target.value))
	const value = useSelector(({ form }) => form.data[fieldName] || '')
	const required = requiredFormIds.indexOf(fieldName) !== -1

	return (
		<div className="form-textarea">
			<label>
				{label}
				{required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
			</label>
			<textarea id={fieldName} value={value} onChange={handleChange} />
		</div>
	)
}

export default Textarea
