import YearFilter from '../Generic/YearFilterComponent'
import FacultyFilter from '../Generic/FacultyFilterComponent'
import LevelFilter from '../Generic/LevelFilterComponent'
import DiscontinuedProgramFilter from '../Generic/DiscontinuedFilterComponent'
import SearchInput from '../Generic/SearchInputComponent'
import { useTranslation } from 'react-i18next'
import { Dispatch, SetStateAction } from 'react'

const FilterComponent = ({ setSearchValue }: { setSearchValue: Dispatch<SetStateAction<string>> }) => {
  const { t } = useTranslation()

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <SearchInput placeholder={t('common:programmeFilter')} setSearchValue={setSearchValue} />
      <LevelFilter />
      <FacultyFilter />
      <YearFilter />
      <DiscontinuedProgramFilter />
    </div>
  )
}

export default FilterComponent
