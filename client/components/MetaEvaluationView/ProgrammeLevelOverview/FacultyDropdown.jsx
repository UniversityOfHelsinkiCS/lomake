import { useState, useEffect } from 'react'
import { Dropdown, MenuItem } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const FacultyDropdown = ({ faculties, debouncedFilter, lang, handleFilterChange }) => {
  const { t } = useTranslation()
  const [dropdownText, setDropdownText] = useState(t('chooseFaculty'))

  useEffect(() => {
    setDropdownText(
      faculties?.data.find(f => f.code === debouncedFilter)?.name[lang]
        ? faculties?.data.find(f => f.code === debouncedFilter)?.name[lang]
        : t('chooseFaculty')
    )
  }, [debouncedFilter, lang, faculties, t])

  const handleDropdownFilter = faculty => {
    if (!faculty) {
      setDropdownText(t('chooseFaculty'))
      handleFilterChange('')
      return
    }

    setDropdownText(faculty.name[lang])
    handleFilterChange(faculty.code)
  }

  return (
    <MenuItem>
      <Dropdown
        className="button basic gray csv-download"
        data-cy="faculty-dropdown"
        direction="left"
        style={{ whiteSpace: 'nowrap', minWidth: 'max-content' }}
        text={dropdownText}
      >
        <Dropdown.Menu>
          <Dropdown.Item data-cy="dropdown-item-all" onClick={() => handleDropdownFilter('')}>
            {t('report:all')}
          </Dropdown.Item>
          {!faculties.pending
            ? [...faculties.data]
                .sort((a, b) => a.name[lang].localeCompare(b.name[lang]))
                .map(faculty => (
                  <Dropdown.Item
                    data-cy={`dropdown-item-${faculty.code}`}
                    key={faculty.code}
                    onClick={() => handleDropdownFilter(faculty)}
                  >
                    {faculty.name[lang]}
                  </Dropdown.Item>
                ))
            : null}
        </Dropdown.Menu>
      </Dropdown>
    </MenuItem>
  )
}

export default FacultyDropdown
