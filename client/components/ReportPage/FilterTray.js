import React from 'react'
import { useSelector } from 'react-redux'
import CompanionFilter from 'Components/Generic/CompanionFilter'
import DoctoralSchoolFilter from 'Components/Generic/DoctoralSchoolFilter'
import LevelFilter from 'Components/Generic/LevelFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import ProgrammeFilter from 'Components/Generic/ProgrammeFilter'
import YearSelector from 'Components/Generic/YearSelector'
import { useTranslation } from 'react-i18next'

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
      <YearSelector size="small" />
      {usersProgrammes && usersProgrammes.length > 5 && (
        <>
          <FacultyFilter size="small" label={t('report:facultyFilter')} />
          <LevelFilter />
          {getCompanionFilter({ faculty, level })}
          {getDoctoralSchoolFilter({ faculty, level })}
          <ProgrammeFilter
            handleChange={handleSearch}
            filter={filter}
            onEmpty={() => setFilter('')}
            t={t}
            label={t('programmeFilter')}
          />
        </>
      )}
    </>
  )
}

export default FilterTray
