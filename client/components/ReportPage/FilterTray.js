import React from 'react'
import { Menu, Container } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import CompanionFilter from 'Components/Generic/CompanionFilter'
import DoctoralSchoolFilter from 'Components/Generic/DoctoralSchoolFilter'
import LevelFilter from 'Components/Generic/LevelFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import ProgrammeFilter from 'Components/Generic/ProgrammeFilter'
import { useTranslation } from 'react-i18next'
import '../Generic/Generic.scss'
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

const getLevelFilter = ({ filters }) => {
  if (filters.form !== formKeys.EVALUATION_FACULTIES && filters.form !== formKeys.FACULTY_MONITORING)
    return <LevelFilter />
  return null
}

const getProgrammeFilter = ({ form, filter, t, handleSearch, setFilter }) => {
  if (form !== formKeys.EVALUATION_FACULTIES && form !== formKeys.FACULTY_MONITORING)
    return <ProgrammeFilter handleChange={handleSearch} filter={filter} onEmpty={() => setFilter('')} t={t} />
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

  if (
    !usersProgrammes ||
    !usersProgrammes.length > 5 ||
    form === formKeys.FACULTY_MONITORING ||
    form === formKeys.EVALUATION_FACULTIES
  )
    return null

  return (
    <>
        {form !== formKeys.EVALUATION_FACULTIES && form !== formKeys.FACULTY_MONITORING && (
          <FacultyFilter size="large" label={t('report:facultyFilter')} />
        )}
      <Menu secondary>
        <Menu.Item>{getLevelFilter({ filters })}</Menu.Item>
      </Menu>
      <Menu secondary>
        <Menu.Item>{getProgrammeFilter({ form, filter, t, handleSearch, setFilter })}</Menu.Item>
        <Menu.Item>{getDoctoralSchoolFilter({ faculty, level })}</Menu.Item>
        <Menu.Item>{getCompanionFilter({ faculty, level })}</Menu.Item>
      </Menu>
    </>
  )
}

export default FilterTray
