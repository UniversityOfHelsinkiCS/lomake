import React from 'react'
import { useSelector } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import './Generic.scss'
import { useTranslation } from 'react-i18next'

const DropdownFilter = ({ size, handleFilterChange, selectedRadio, version }) => {
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const studyProgrammes = useSelector(state => state.studyProgrammes.data)
  const { t } = useTranslation()

  const handleChange = (e, { value }) => {
    handleFilterChange({ firstPart: selectedRadio.firstValue, secondPart: value, thirdPart: '' })
  }

  const getOptions = () => {
    const options = []
    if (!faculties) return []
    if (version === 'specific-programme') {
      return options.concat(
        studyProgrammes.map(s => ({
          key: s.key,
          value: s.key,
          text: s.name[lang],
        }))
      )
    }
    return options.concat(
      faculties.map(f => ({
        key: f.code,
        value: f.code,
        text: f.name[lang],
      }))
    )
  }

  return (
    <div className={`dropdown-filter-${size}`}>
      <label>{version === 'faculty' ? t('chooseFaculty') : t('chooseProgramme')}</label>
      <Dropdown
        data-cy="dropdown-filter"
        fluid
        selection
        search
        options={getOptions()}
        onChange={handleChange}
        value={selectedRadio.secondValue}
      />
    </div>
  )
}

export default DropdownFilter
