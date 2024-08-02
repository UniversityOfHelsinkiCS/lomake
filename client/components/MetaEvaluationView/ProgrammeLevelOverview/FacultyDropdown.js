import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'

const FacultyDropdown = ({ t, handleFilterChange, faculties, lang, debouncedFilter }) => {
  const [dropdownText, setDropdownText] = useState(t('chooseFaculty'))

  useEffect(() => {
    if (debouncedFilter === '') setDropdownText(t('chooseFaculty'))
  }, [debouncedFilter])

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
    <div>
      <Dropdown
        data-cy="faculty-dropdown"
        text={dropdownText}
        className="button basic gray csv-download"
        direction="left"
      >
        <Dropdown.Menu>
          <Dropdown.Item data-cy="dropdown-item-all" onClick={() => handleDropdownFilter('')}>
            {t('report:all')}
          </Dropdown.Item>
          {faculties?.data
            .sort((a, b) => a.name[lang].localeCompare(b.name[lang]))
            .map(faculty => (
              <Dropdown.Item
                data-cy={`dropdown-item-${faculty.code}`}
                key={faculty.code}
                onClick={() => handleDropdownFilter(faculty)}
              >
                {faculty.name[lang]}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default FacultyDropdown