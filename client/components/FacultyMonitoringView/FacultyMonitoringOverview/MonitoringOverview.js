import React, { useMemo } from 'react'
import { Menu, MenuItem } from 'semantic-ui-react'

import { Link } from 'react-router-dom'

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
        <MenuItem header style={{ paddingLeft: 0 }}>
          <h2 style={{ maxWidth: '16em' }}>{t('facultymonitoring').toUpperCase()}</h2>
        </MenuItem>
      </Menu>

      <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start' }}>
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
