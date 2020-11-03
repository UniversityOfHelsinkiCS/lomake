import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { setSelectedFaculty } from 'Utilities/redux/facultyReducer'
import { clearDoctorFilters } from 'Utilities/redux/filterReducer'
import faculties from '../../facultyTranslations'
import './Filters.scss'


const FacultyFilter = ({ size, label }) => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)
  const selectedFaculty = useSelector(({ faculties }) => faculties.selectedFaculty)

  const handleChange = (e, { value }) => {
    dispatch(clearDoctorFilters())
    dispatch(setSelectedFaculty(value))
  }

  return (
    <div className={`faculty-filter-${size}`}>
      <label>{label}</label>
      <Select
        data-cy="faculty-filter"
        fluid
        selection
        options={faculties[lang]}
        onChange={handleChange}
        value={selectedFaculty}
      />
    </div>
  )
}

export default FacultyFilter