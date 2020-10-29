import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { setSelectedYear } from 'Utilities/redux/formReducer'
import './Filters.scss'

export default function YearSelector() {
  const previousYearsWithAnswers = useSelector((state) => state.oldAnswers.years)
  const selectedYear = useSelector((state) => state.form.selectedYear)
  const languageCode = useSelector((state) => state.language)
  const [yearOptions, setYearOptions] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    if (!previousYearsWithAnswers) return
    const currentYear = new Date().getFullYear()
    let temp = previousYearsWithAnswers
    if (!temp.includes(currentYear)) temp.push(currentYear)
    const options = temp.map((y) => {
      return {
        key: y,
        value: y,
        text: y,
      }
    })
    setYearOptions(options)
  }, [previousYearsWithAnswers])

  const handleYearChange = (e, { value }) => {
    dispatch(setSelectedYear(value))
  }

  if (!previousYearsWithAnswers) return null

  return (
    <Select
      className="button basic gray"
      disabled={yearOptions.length <= 1}
      data-cy="yearSelector"
      name="year"
      options={yearOptions}
      onChange={handleYearChange}
      value={selectedYear}
    />
  )
}
