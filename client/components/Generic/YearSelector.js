import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { setYear, setMultipleYears } from 'Utilities/redux/filterReducer'
import { setViewOnly, setViewingOldAnswers } from 'Utilities/redux/formReducer'
import './Filters.scss'

export default function YearSelector({ multiple, size, label }) {
  const previousYearsWithAnswers = useSelector((state) => state.oldAnswers.years)
  const year = useSelector(({ filters }) => filters.year)
  const multipleYears = useSelector(({ filters }) => filters.multipleYears)
  const [yearOptions, setYearOptions] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    if (!previousYearsWithAnswers) return
    const currentYear = new Date().getFullYear()
    let temp = previousYearsWithAnswers
    if (!temp.includes(currentYear)) temp.unshift(currentYear)
    const options = temp.map((y) => {
      return {
        key: y,
        value: y,
        text: y,
      }
    })
    setYearOptions(options)
  }, [previousYearsWithAnswers])

  const handleYearChange = (_, { value }) => {
    if (value !== new Date().getFullYear()) {
      dispatch(setViewOnly(true))
      dispatch(setViewingOldAnswers(true))
    } else {
      dispatch(setViewOnly(false))
      dispatch(setViewingOldAnswers(false))
    }
    dispatch(setYear(value))
  }

  const handleMultipleYearChange = (_, { value }) => {
    dispatch(setMultipleYears(value))
  }

  return (
    <div className={`year-filter-${size}`}>
      {multiple && <label>{label}</label>}
      <Select
        className="button basic gray"
        disabled={!previousYearsWithAnswers || yearOptions.length <= 1}
        data-cy="yearSelector"
        name="year"
        fluid
        placeholder="Year"
        options={yearOptions}
        onChange={multiple ? handleMultipleYearChange : handleYearChange}
        value={multiple ? multipleYears : year}
        multiple={multiple}
        selection={multiple}
      />
  </div>
  )
}
