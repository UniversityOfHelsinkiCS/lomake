import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { setYear, setMultipleYears } from 'Utilities/redux/filterReducer'
import { setViewOnly, setViewingOldAnswers } from 'Utilities/redux/formReducer'
import { genericTranslations as translations } from 'Utilities/translations'
import './Filters.scss'

export default function YearSelector({ multiple, size, label }) {
  const previousYearsWithAnswers = useSelector((state) => state.oldAnswers.years)
  const lang = useSelector((state) => state.language)
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
    if (value.length > 3) dispatch(setMultipleYears(value.slice(value.length - 3), value.length)) 
    else dispatch(setMultipleYears(value))
  }

  return (
    <div className={`year-filter-${size}`}>
      {multiple && <label className={`year-filter-label${multipleYears.length === 0 ? '-alert' : ''}`}>{label}</label>}
      <Select
        className="button basic gray"
        disabled={!previousYearsWithAnswers || yearOptions.length <= 1}
        data-cy="yearSelector"
        name="year"
        fluid
        placeholder={translations.year[lang]}
        options={yearOptions}
        onChange={multiple ? handleMultipleYearChange : handleYearChange}
        value={multiple ? multipleYears : year}
        multiple={multiple}
        selection={multiple}
      />
  </div>
  )
}
