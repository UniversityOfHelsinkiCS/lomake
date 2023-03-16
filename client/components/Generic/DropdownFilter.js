import React from 'react'
import { useSelector } from 'react-redux'
import { Select } from 'semantic-ui-react'
import './Generic.scss'

const DropdownFilter = ({ size, label, handleFilterChange, selectedRadio }) => {
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)

  let selectedFirstPart = ''
  let selectedSecondPart = ''

  const isThereALine = selectedRadio.indexOf('-') === -1
  if (isThereALine) {
    const indexOfLine = selectedRadio.length
    selectedFirstPart = selectedRadio.substring(0, indexOfLine)
  } else {
    const indexOfLine = selectedRadio.indexOf('-')
    selectedFirstPart = selectedRadio.substring(0, indexOfLine)
    selectedSecondPart = selectedRadio.substring(indexOfLine + 1, selectedRadio.length)
  }

  const handleChange = (e, { value }) => {
    handleFilterChange(selectedFirstPart, value)
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
    <div className={`faculty-filter-${size}`}>
      <label>{label}</label>
      <Select
        data-cy="faculty-filter"
        fluid
        selection
        options={faculties ? getOptions() : []}
        onChange={handleChange}
        value={selectedSecondPart}
      />
    </div>
  )
}

export default DropdownFilter
