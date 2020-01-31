import React from 'react'
import { useDispatch } from 'react-redux'
import Dropdown from 'Components/Generic/Dropdown'
import { degreeLevels, programmes, faculties } from "Utilities/common"
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'

const ProgrammeSelect = () => {
  const dispatch = useDispatch()

  const handleChange = async ({ target }) => {
    const { id, value } = target
    if (id !== "programme") return
    await dispatch(wsLeaveRoom(value))
    dispatch(wsJoinRoom(value))
  }

  return (
    <>
      <Dropdown id="degree_level" label="Degree level *" options={degreeLevels} onChange={handleChange} />
      <Dropdown id="programme" label="Degree programme title *" options={programmes} onChange={handleChange} />
      <Dropdown id="faculty" label="Faculty responsible for the programme *" options={faculties} onChange={handleChange} />
    </>
  )
}

export default ProgrammeSelect
