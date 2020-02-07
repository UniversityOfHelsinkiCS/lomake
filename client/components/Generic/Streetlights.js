import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import './Streetlights.scss'

const Streetlights = ({ label, id }) => {
	const dispatch = useDispatch()
	const fieldName = `${id}_light`
	const choose = (name, id) => dispatch(updateFormField(name, id))
	const value = useSelector(({ form }) => form.data[fieldName])

	return (
		<div className="form-streetlights">
			<label>
				{label}
				<span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>
			</label>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div className="traffic-light">
					<div
						id="red"
						title="Red: Significant measures required/development areas not yet specified"
						name={fieldName}
						className={value === 'red' ? 'circle red-active' : 'circle red'}
						onClick={() => choose(fieldName, 'red')}
					/>
					<div
						id="yellow"
						title="Yellow: Challenges identified and development underway"
						name={fieldName}
						className="circle yellow"
						className={value === 'yellow' ? 'circle yellow-active' : 'circle yellow'}
						onClick={() => choose(fieldName, 'yellow')}
					/>
					<div
						id="green"
						title="Green: No issues"
						name={fieldName}
						className="circle green"
						className={value === 'green' ? 'circle green-active' : 'circle green'}
						onClick={() => choose(fieldName, 'green')}
					/>
				</div>
			</div>
		</div>
	)
}

export default Streetlights
