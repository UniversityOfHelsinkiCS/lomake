import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { setSelectedYear } from 'Utilities/redux/formReducer'
import './YearSelector.scss'

const translations = {
  selectYear: {
    en: 'Select the year you would like to inspect',
    fi: 'Valitse vuosi jota haluat tarkastella',
    se: '',
  },
}

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
    <div className="year-filter">
      <label>{translations.selectYear[languageCode]}</label>
      <Select
        disabled={yearOptions.length <= 1}
        data-cy="yearSelector"
        name="year"
        options={yearOptions}
        onChange={handleYearChange}
        value={selectedYear}
      />
    </div>
  )
}
