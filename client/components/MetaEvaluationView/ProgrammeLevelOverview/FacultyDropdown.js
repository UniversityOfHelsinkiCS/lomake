import React, { useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { data as facultyList } from '@root/config/data'

const FacultyDropdown = ({ t, programmes, setUsersProgrammes, doctoral, faculties, lang }) => {
  const [dropdownText, setDropdownText] = useState(t('chooseFaculty'))

  const handleDropdownFilter = faculty => {
    if (!faculty) {
      setDropdownText(t('chooseFaculty'))
      setUsersProgrammes(programmes)
      return
    }

    setDropdownText(faculty.name[lang])
    const facultyData = facultyList.find(item => item.code === faculty.code)
    const filteredPrograms = facultyData.programmes
      .filter(item => (doctoral ? item.level === 'doctoral' : item.level !== 'doctoral'))
      .map(program => program.key)
  
    setUsersProgrammes(programmes.filter(a => filteredPrograms.includes(a.key)))
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
