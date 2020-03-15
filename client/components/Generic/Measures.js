import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import Textarea from './Textarea'
import { Button } from 'semantic-ui-react'
import SimpleTextarea from './SimpleTextarea'

const measureLabel = {
	fi: 'TOIMENPIDELISTA (1-5 toimenpidettä)',
	en: 'MEASURES (1-5)',
	se: 'ÄTGÄRDER (1-5)'
}

const Measures = ({ label, id, required, number }) => {
	const dispatch = useDispatch()
	const clearMeasure = (number) => dispatch(updateFormField(`${id}_${number}_text`, ''))
	const formData = useSelector((state) => state.form.data)
	const languageCode = useSelector((state) => state.language)

	const getInitialAmount = () => {
		let measureNumber = 1
		while (measureNumber <= 5) {
			if (formData[`${id}_${measureNumber}_text`]) {
				measureNumber++
			} else {
				break
			}
		}

		if (measureNumber === 1) return 1

		return measureNumber - 1
	}

	const [amountOfMeasures, setAmountOfMeasures] = useState(getInitialAmount())

	return (
		<>
			<h3>
				{number}. {label}
			</h3>
			<label>
				{number}. {measureLabel[languageCode]}
				{required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
			</label>
			{['', '', '', '', ''].reduce((acc, cur, index) => {
				if (index + 1 > amountOfMeasures) return acc
				acc.push(
					<div style={{ paddingTop: '0' }} key={index}>
						<SimpleTextarea label={`${index + 1})`} id={`${id}_${index + 1}`} />
					</div>
				)
				return acc
			}, [])}
			<div style={{ display: 'flex', justifyContent: 'flex-start' }}>
				<Button
					className="ui button"
					disabled={amountOfMeasures === 5 || !formData[`${id}_${amountOfMeasures}_text`]}
					onClick={() => setAmountOfMeasures(amountOfMeasures + 1)}
				>
					Add measure
				</Button>
				<span style={{ marginLeft: '5px' }}>
					<Button
						className="ui button"
						disabled={amountOfMeasures === 1}
						onClick={() => {
							setAmountOfMeasures(amountOfMeasures - 1)
							clearMeasure(amountOfMeasures)
						}}
					>
						Remove measure
					</Button>
				</span>
			</div>
		</>
	)
}

export default Measures
