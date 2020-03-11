import React from 'react'
import { requiredFormIds } from 'Utilities/common'
import { Dropdown as SemanticDropdown } from 'semantic-ui-react'

const Dropdown = ({ id, value, onChange, label, options, search }) => {
	const required = requiredFormIds.indexOf(id) !== -1
	return (
		<div className="form-dropdown">
			<label>
				{label}
				{required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
			</label>
			<SemanticDropdown
				id={id}
				value={value}
				placeholder="Select"
				onChange={onChange}
				fluid
				search={search}
				selection
				options={options.map((option) => ({ key: option, value: option, text: option }))}
			/>
		</div>
	)
}

export default Dropdown
