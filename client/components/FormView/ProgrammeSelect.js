import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Dropdown from 'Components/Generic/Dropdown'
import { degreeLevels, programmes, faculties } from 'Utilities/common'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'

const ProgrammeSelect = () => {
	const dispatch = useDispatch()
	const [chosenProgramme, setProgramme] = useState('')
	const [chosenDegreeLevel, setDegree] = useState('')
	const [chosenFaculty, setFaculty] = useState('')

	const handleChange = async ({ target }) => {
		const { id, value } = target
		if (id === 'degree_level') setDegree(value)
		if (id === 'faculty') setFaculty(value)
	}

	const handleRoomChange = async ({ target }) => {
		const { value } = target
		await dispatch(wsLeaveRoom(value))
		dispatch(wsJoinRoom(value))
		setProgramme(value)
	}

	/**
	 * Total insanity
	 */
	const filteredProgrammes = programmes.filter(prog => {
		if (!chosenDegreeLevel) return true

		const starting = prog.substr(0, 4)
		const shortDegrees = degreeLevels.map(dl => dl.substr(0, 4))
		if (!shortDegrees.includes(starting)) return true

		if (chosenDegreeLevel.includes(starting)) return true
		return false
	})

	return (
		<>
			<Dropdown
				id="faculty"
				value={chosenFaculty}
				label="Faculty responsible for the programme"
				options={faculties}
				onChange={handleChange}
				required
			/>
			<Dropdown
				id="degree_level"
				value={chosenDegreeLevel}
				label="Degree level"
				options={degreeLevels}
				onChange={handleChange}
				required
			/>
			<Dropdown
				id="programme"
				value={chosenProgramme}
				label="Degree programme title"
				options={filteredProgrammes}
				onChange={handleRoomChange}
				required
			/>
		</>
	)
}

export default ProgrammeSelect
