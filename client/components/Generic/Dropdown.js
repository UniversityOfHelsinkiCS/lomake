import React from 'react'
import { requiredFormIds } from 'Utilities/common'

const Dropdown = ({ id, onChange, label, options }) => {
	const required = requiredFormIds.indexOf(id) !== -1

	const handleChange = () => {
		console.warn('123 Not yet implemented')
	}
	return (
		<div className="form-dropdown">
			<label>
				{label}
				{required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
			</label>
			<select id={id} onChange={onChange || handleChange} defaultValue="Select:">
				<option disabled> Select: </option>
				{options.map(o => (
					<option key={o}>{o}</option>
				))}
			</select>
		</div>
	)
}

export default Dropdown
