import React from 'react'
import { useSelector } from 'react-redux'
import { Select } from 'semantic-ui-react'
import './Generic.scss'

const DropdownFilter = ({ size, label, handleFilterChange, selectedRadio }) => {
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)

  const handleChange = (e, { value }) => {
    handleFilterChange(selectedRadio[0], value)
  }

  const getOptions = () => {
    const facultiesWithAll = []
    return facultiesWithAll.concat(
      faculties.map(f => ({
        key: f.code,
        value: f.code,
        text: f.name[lang],
      }))
    )
  }

  return (
    <div className={`dropdown-filter-${size}`}>
      <label>{label}</label>
      <Select
        data-cy="dropdown-filter"
        fluid
        selection
        options={faculties ? getOptions() : []}
        onChange={handleChange}
        value={selectedRadio[1]}
      />
    </div>
  )
}

export default DropdownFilter
