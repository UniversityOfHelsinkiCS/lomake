import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { clearLevelSpecificFilters, setFaculty } from 'Utilities/redux/filterReducer'
import './Generic.scss'

const FacultyFilter = ({ size, label, version, handleFilterChange }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const faculty = useSelector(({ filters }) => filters.faculty)

  const handleChange = (e, { value }) => {
    dispatch(clearLevelSpecificFilters())
    dispatch(setFaculty(value))
    handleFilterChange('faculty')
  }

  const getOptions = () => {
    let facultiesWithAll = []
    if (version !== 'degree-reform') {
      facultiesWithAll = facultiesWithAll.concat([
        { key: 'allFaculties', value: 'allFaculties', text: t('generic:allFaculties') },
      ])
    }
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
