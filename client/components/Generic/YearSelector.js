import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { setYear, setMultipleYears } from 'Utilities/redux/filterReducer'
import { setViewOnly, setViewingOldAnswers } from 'Utilities/redux/formReducer'
import { getYearsUserHasAccessToAction } from 'Utilities/redux/currentUserReducer'
import './Generic.scss'

// eslint-disable-next-line react/function-component-definition
export default function YearSelector({ multiple, size, label }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const previousYearsWithAnswers = useSelector(state => state.oldAnswers.years)
  const currentUser = useSelector(state => state.currentUser.data)
  const year = useSelector(({ filters }) => filters.year)
  const draftYear = useSelector(({ deadlines }) => deadlines.draftYear)
  const multipleYears = useSelector(({ filters }) => filters.multipleYears)
  const [yearOptions, setYearOptions] = useState([])

  const handleYearChange = (_, { value }) => {
    if (!draftYear || (draftYear && draftYear.year !== value)) {
      dispatch(setViewOnly(true))
      dispatch(setViewingOldAnswers(true))
    } else {
      dispatch(setViewOnly(false))
      dispatch(setViewingOldAnswers(false))
    }
    dispatch(setYear(value))
  }

  useEffect(() => {
    if (!previousYearsWithAnswers || !currentUser) return
    let years = getYearsUserHasAccessToAction(currentUser)
    const url = window.location.href
    const facStart = url.indexOf('form=')
    if (facStart !== -1) {
      const formNumber = Number(url.substring(facStart + 5))
      if (formNumber === 4 || formNumber === 5) {
        years = [2023]
        handleYearChange(null, { value: 2023 })
      }
    }

    const options = years.map(y => {
      return {
        key: y,
        value: y,
        text: y,
      }
    })
    setYearOptions(options)
  }, [previousYearsWithAnswers, currentUser])

  const handleMultipleYearChange = (_, { value }) => {
    if (value.length > 3) dispatch(setMultipleYears(value.slice(value.length - 3), value.length))
    else dispatch(setMultipleYears(value))
  }

  if (!currentUser) return null
  if (yearOptions.length === 1) return <div />

  return (
    <div className={`year-filter-${size}`}>
      {multiple && <label className={`year-filter-label${multipleYears.length === 0 ? '-alert' : ''}`}>{label}</label>}
      <Select
        className="button basic gray"
        disabled={!year || !previousYearsWithAnswers || yearOptions.length <= 1}
        data-cy="yearSelector"
        name="year"
        fluid
        placeholder={t('generic:year')}
        options={yearOptions}
        onChange={multiple ? handleMultipleYearChange : handleYearChange}
        value={multiple ? multipleYears : year}
        multiple={multiple}
        selection={multiple}
      />
    </div>
  )
}
