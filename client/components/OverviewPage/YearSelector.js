import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { setSelectedYear } from 'Utilities/redux/formReducer'

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
      }}
    >
      <span>{translations.selectYear[languageCode]}</span>
      <Select
        data-cy="yearSelector"
        name="year"
        options={yearOptions}
        onChange={handleYearChange}
        value={selectedYear}
      />
    </div>
  )
}
