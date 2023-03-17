import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { clearLevelSpecificFilters, setDoctoralSchool } from 'Utilities/redux/filterReducer'
import './Generic.scss'

const DoctoralSchoolFilter = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const doctoralSchool = useSelector(({ filters }) => filters.doctoralSchool)

  const handleChange = (e, { value }) => {
    dispatch(clearLevelSpecificFilters())
    dispatch(setDoctoralSchool(value))
  }

  const options = [
    {
      key: 'allSchools',
      text: t('generic:allDoctoralSchools'),
      value: 'allSchools',
    },
    {
      key: 'social',
      text: t('generic:socialSchool'),
      value: 'social',
    },
    {
      key: 'sciences',
      text: t('generic:sciencesSchool'),
      value: 'sciences',
    },
    {
      key: 'health',
      text: t('generic:healthSchool'),
      value: 'health',
    },
    {
      key: 'environmental',
      text: t('generic:environmentalSchool'),
      value: 'environmental',
    },
  ]

  return (
    <div className="doctoral-school-filter">
      <label>{t('generic:doctoralSchoolFilter')}</label>
      <Select
        data-cy="doctoral-school-filter"
        fluid
        selection
        options={options}
        onChange={handleChange}
        value={doctoralSchool}
      />
    </div>
  )
}

export default DoctoralSchoolFilter
