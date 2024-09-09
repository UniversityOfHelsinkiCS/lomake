import React, { useMemo } from 'react'
import { Menu, MenuItem } from 'semantic-ui-react'

import { Link } from 'react-router-dom'
import './FacultyMonitoringOverview.scss'

const MonitoringOverview = ({ t, lang, faculties }) => {
  const filteredFaculties = useMemo(
    () =>
      faculties
        .filter(f => f.code !== 'HTEST')
        .map(f => ({
          key: f.code,
          text: f.name[lang],
        })),
    [faculties, lang],
  )

  return (
    <>
      <Menu size="large" className="filter-row" secondary>
        <MenuItem header className="menu-item-header">
          <h2>{t('facultymonitoring').toUpperCase()}</h2>
        </MenuItem>
      </Menu>

      <div className="flex-container">
        {filteredFaculties.map(faculty => (
          <Link key={faculty.key} to={`/faculty-monitoring/${faculty.key}`}>
            {faculty.text} {faculty.key}
          </Link>
        ))}
      </div>
    </>
  )
}

export default MonitoringOverview
