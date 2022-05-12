import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { clearLevelSpecificFilters, setFaculty } from 'Utilities/redux/filterReducer'
import { genericTranslations as translations } from 'Utilities/translations'
import './Generic.scss'

const FacultyFilter = ({ size, label }) => {
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const faculty = useSelector(({ filters }) => filters.faculty)

  const handleChange = (e, { value }) => {
    dispatch(clearLevelSpecificFilters())
    dispatch(setFaculty(value))
  }

  const getOptions = () => {
    const facultiesWithAll = [{ key: 'allFaculties', value: 'allFaculties', text: translations.allFaculties[lang] }]
    return facultiesWithAll.concat(
      faculties.map(f => ({
        key: f.code,
        value: f.code,
        text: f.name[lang],
      }))
    )
  }

  return (
    <div className={`faculty-filter-${size}`}>
      <label>{label}</label>
      <Select
        data-cy="faculty-filter"
        fluid
        selection
        options={faculties ? getOptions() : []}
        onChange={handleChange}
        value={faculty}
      />
    </div>
  )
}

export default FacultyFilter
