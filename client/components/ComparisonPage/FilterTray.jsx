import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import YearSelector from 'Components/Generic/YearSelector'
import CompanionFilter from 'Components/Generic/CompanionFilter'
import DoctoralSchoolFilter from 'Components/Generic/DoctoralSchoolFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import ProgrammeFilter from 'Components/Generic/ProgrammeFilter'
import LevelFilter from 'Components/Generic/LevelFilter'
import FormFilter from 'Components/Generic/FormFilter'
import { formKeys } from '@root/config/data'

const getCompanionFilter = ({ faculty, level }) => {
  if (faculty[0] !== 'allFaculties' && (level === 'doctoral' || level === 'master' || level === 'bachelor'))
    return <CompanionFilter />
  return null
}

const getDoctoralSchoolFilter = ({ faculty, level }) => {
  if (faculty[0] === 'allFaculties' && level === 'doctoral') return <DoctoralSchoolFilter />
  return null
}

const getLevelFilter = ({ form }) => {
  const url = window.location.href
  const facStart = url.indexOf('/comparison')
  if (form === formKeys.EVALUATION_FACULTIES) {
    if (facStart !== -1) {
      return <LevelFilter comparison />
    }
    return null
  }

  return <LevelFilter />
}

const getFacultyFilter = ({ form, t }) => {
  if (form !== formKeys.EVALUATION_FACULTIES)
    return <FacultyFilter size="small" label={t('comparison:filterFaculties')} />
  return null
}

const getProgrammeFilter = ({ form, filter, t, handleSearch, setFilter }) => {
  if (form !== formKeys.EVALUATION_FACULTIES)
    return (
      <ProgrammeFilter
        handleChange={handleSearch}
        label={t('programmeFilter')}
        filter={filter}
        onEmpty={() => setFilter('')}
        t={t}
      />
    )
  return null
}

const FilterTray = ({ filter, setFilter }) => {
  const { t } = useTranslation()
  const filters = useSelector(state => state.filters)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const { faculty, level, form } = filters

  const handleSearch = ({ target }) => {
    const { value } = target
    setFilter(value)
  }
  return (
    <>
      <YearSelector multiple size="small" label={t('comparison:selectYears')} />
      <FormFilter />
      {usersProgrammes && (
        <>
          {getFacultyFilter({ form, t })}
          {getLevelFilter({ form })}
          {getCompanionFilter({ faculty, level })}
          {getDoctoralSchoolFilter({ faculty, level })}
          {getProgrammeFilter({ form, filter, t, handleSearch, setFilter })}
        </>
      )}
    </>
  )
}

export default FilterTray
