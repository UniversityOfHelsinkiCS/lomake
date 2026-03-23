import { useSelector } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import YearSelector from '../Generic/YearSelector'
import CompanionFilter from '../Generic/CompanionFilter'
import DoctoralSchoolFilter from '../Generic/DoctoralSchoolFilter'
import FacultyFilter from '../Generic/FacultyFilter'
import ProgrammeFilter from '../Generic/ProgrammeFilter'
import LevelFilter from '../Generic/LevelFilter'
import FormFilter from '../Generic/FormFilter'
import { formKeys } from '../../../config/data'

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
    return <FacultyFilter label={t('comparison:filterFaculties')} size="small" />
  return null
}

const getProgrammeFilter = ({ form, filter, t, handleSearch, setFilter }) => {
  if (form !== formKeys.EVALUATION_FACULTIES)
    return (
      <ProgrammeFilter
        filter={filter}
        handleChange={handleSearch}
        label={t('programmeFilter')}
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
      <Menu secondary>
        <Menu.Item>
          <YearSelector label={t('comparison:selectYears')} multiple size="small" />
        </Menu.Item>
        <Menu.Item>
          <FormFilter comparison />
        </Menu.Item>
      </Menu>
      {usersProgrammes ? (
        <div style={{ paddingLeft: '1em' }}>
          {getFacultyFilter({ form, t })}
          {getLevelFilter({ form })}
          {getCompanionFilter({ faculty, level })}
          {getDoctoralSchoolFilter({ faculty, level })}
          {getProgrammeFilter({ form, filter, t, handleSearch, setFilter })}
        </div>
      ) : null}
    </>
  )
}

export default FilterTray
