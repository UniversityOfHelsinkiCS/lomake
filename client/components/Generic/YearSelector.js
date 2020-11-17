import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { setYear, setReportYears } from 'Utilities/redux/filterReducer'
import { setViewOnly, setViewingOldAnswers } from 'Utilities/redux/formReducer'
import './Filters.scss'

export default function YearSelector({ reportSelector }) {
  const previousYearsWithAnswers = useSelector((state) => state.oldAnswers.years)
  const year = useSelector(({ filters }) => filters.year)
  const reportYears = useSelector(({ filters }) => filters.reportYears)
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

  const handleReportYearChange = (_, { value }) => {
    dispatch(setReportYears(value))
  }

  return (
    reportSelector 
      ? 
      <Select
        className="button basic gray year-filter"
        disabled={!previousYearsWithAnswers || yearOptions.length <= 1}
        data-cy="reportSelector"
        name="year"
        fluid
        placeholder="Select years"
        options={yearOptions}
        onChange={handleReportYearChange}
        value={reportYears}
        multiple
        selection
      />
      : 
      <Select
        className="button basic gray"
        disabled={!previousYearsWithAnswers || yearOptions.length <= 1}
        data-cy="yearSelector"
        name="year"
        options={yearOptions}
        onChange={handleYearChange}
        value={year}
      />
  )
}
