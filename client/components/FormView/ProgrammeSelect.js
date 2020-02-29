import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dropdown from 'Components/Generic/Dropdown'
import { degreeLevels, programmes, faculties } from 'Utilities/common'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'

const translations = {
  degreeLevel: {
    en: 'Degree level',
    fi: 'Koulutusohjelman tutkintotaso',
    se: 'Examensnivå '
  },
  degreeProgramme: {
    en: 'Degree programme title',
    fi: 'Koulutusohjelman nimi',
    se: 'Utbildningsprogrammets namn'
  },
  faculty: {
    en: 'Faculty responsible for the programme',
    fi: 'Koulutusohjelman vastuutiedekunta',
    se: 'Det ansvariga kakultetet för programmet '
  }
}

const ProgrammeSelect = () => {
  const languageCode = useSelector((state) => state.language)
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
  const filteredProgrammes = programmes.filter((prog) => {
    if (!chosenDegreeLevel) return true

    const starting = prog.substr(0, 4)
    const shortDegrees = degreeLevels.map((dl) => dl.substr(0, 4))
    if (!shortDegrees.includes(starting)) return true

    if (chosenDegreeLevel.includes(starting)) return true
    return false
  })

  return (
    <>
      <Dropdown
        id="faculty"
        value={chosenFaculty}
        label={translations.faculty[languageCode]}
        options={faculties}
        onChange={handleChange}
        required
      />
      <Dropdown
        id="degree_level"
        value={chosenDegreeLevel}
        label={translations.degreeLevel[languageCode]}
        options={degreeLevels}
        onChange={handleChange}
        required
      />
      <Dropdown
        id="programme"
        value={chosenProgramme}
        label={translations.degreeProgramme[languageCode]}
        options={filteredProgrammes}
        onChange={handleRoomChange}
        required
      />
    </>
  )
}

export default ProgrammeSelect
