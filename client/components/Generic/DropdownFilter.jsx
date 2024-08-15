import React from 'react'
import { useSelector } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import './Generic.scss'
import { useTranslation } from 'react-i18next'

const byNameInLang = lang => (p1, p2) => {
  const n1 = p1.name[lang]
  const n2 = p2.name[lang]
  return n1 < n2 ? -1 : 1
}

const DropdownFilter = ({ size, handleFilterChange, selectedRadio, version }) => {
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data).sort(byNameInLang(lang))
  const studyProgrammes = useSelector(state => state.studyProgrammes.data).sort(byNameInLang(lang))

  const { t } = useTranslation()

  const handleChange = (e, { value }) => {
    handleFilterChange({ firstPart: selectedRadio.firstValue, secondPart: value, thirdPart: '' })
  }

  const getOptions = () => {
    const options = []
    if (!faculties) return []
    if (selectedRadio.firstValue === 'specific-programme') {
      const filteredStudyProgrammes = studyProgrammes
        .filter(s => {
          if (version === 'bachelor') {
            return s.key.startsWith('KH')
          }
          if (version === 'master') {
            return s.key.startsWith('MH')
          }
          if (version === 'international') {
            return s.international
          }
          if (version === 'doctoral') {
            return s.key.startsWith('T')
          }
          if (version === 'all') {
            return true
          }
          return false
        })
        .map(s => s)
      return options.concat(
        filteredStudyProgrammes.map(s => ({
          key: s.key,
          value: s.key,
          text: s.name[lang],
        })),
      )
    }

    return options.concat(
      faculties.map(f => ({
        key: f.code,
        value: f.code,
        text: f.name[lang],
      })),
    )
  }

  return (
    <div className={`dropdown-filter-${size}`}>
      <label>{selectedRadio.firstValue === 'faculty' ? t('chooseFaculty') : t('chooseProgramme')}</label>
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
