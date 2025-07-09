import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { clearLevelSpecificFilters, setFaculty } from '../../redux/filterReducer'
import './Generic.scss'

const FacultyFilter = ({ label }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const selectedFaculties = useSelector(({ filters }) => filters.faculty)

  const handleChange = (e, { value }) => {
    dispatch(clearLevelSpecificFilters())
    if (value.length < 1) {
      if (selectedFaculties[0] === 'allFaculties') {
        return
      }
      dispatch(setFaculty(['allFaculties']))
      return
    }
    const tempNewValue = value
    if (value[0] === 'allFaculties') {
      tempNewValue.shift()
    }
    if (tempNewValue.includes('allFaculties')) {
      dispatch(setFaculty(['allFaculties']))
      return
    }
    dispatch(setFaculty(tempNewValue))
  }

  const getOptions = () => {
    const facultiesWithAll = [{ key: 'allFaculties', value: 'allFaculties', text: t('generic:allFaculties') }]
    return facultiesWithAll.concat(
      faculties
        .filter(f => f.code !== 'HTEST' && f.code !== 'UNI')
        .map(f => ({
          key: f.code,
          value: f.code,
          text: f.name[lang],
        })),
    )
  }
  return (
    <div>
      <label>{label}</label>
      <Dropdown
        data-cy="faculty-filter"
        fluid
        multiple
        selection
        options={faculties ? getOptions() : []}
        onChange={handleChange}
        value={selectedFaculties}
        className="responsive-dropdown"
      />
    </div>
  )
}

export default FacultyFilter
