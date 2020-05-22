import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { setSelectedYear } from 'Utilities/redux/formReducer'

export default function YearSelector() {
  const previousYearsWithAnswers = useSelector((state) => state.oldAnswers.years)
  const selectedYear = useSelector((state) => state.form.selectedYear)
  const [yearOptions, setYearOptions] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    if (!previousYearsWithAnswers) return
    let temp = [...previousYearsWithAnswers, new Date().getFullYear()]
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
    <>
      <span>Select year</span>
      <Select
        data-cy="overviewpage-year"
        name="year"
        options={yearOptions}
        onChange={handleYearChange}
        value={selectedYear}
      />
    </>
  )
}
