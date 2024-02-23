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

const getCompanionFilter = ({ faculty, level }) => {
  if (faculty !== 'allFaculties' && (level === 'doctoral' || level === 'master' || level === 'bachelor'))
    return <CompanionFilter />
  return null
}

const getDoctoralSchoolFilter = ({ faculty, level }) => {
  if (faculty === 'allFaculties' && level === 'doctoral') return <DoctoralSchoolFilter />
  return null
}

const FilterTray = ({ filter, setFilter }) => {
  const { t } = useTranslation()
  const filters = useSelector(state => state.filters)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const { faculty, level } = filters

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
          <FacultyFilter size="small" label={t('comparison:filterFaculties')} />
          <LevelFilter />
          {getCompanionFilter({ faculty, level })}
          {getDoctoralSchoolFilter({ faculty, level })}
          <ProgrammeFilter
            handleChange={handleSearch}
            label={t('programmeFilter')}
            filter={filter}
            onEmpty={() => setFilter('')}
            t={t}
          />
        </>
      )}
    </>
  )
}

export default FilterTray
