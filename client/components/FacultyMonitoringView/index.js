import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'
import { Link } from 'react-router-dom'

const FacultyMonitoringOverview = () => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const form = formKeys.FACULTY_MONITORING
  const formType = 'faculty-evaluation'

  useEffect(() => {
    document.title = `${t('facultymonitoring')}`
  }, [lang, t])

  const filteredFaculties = useMemo(
    () =>
      faculties
        .filter(f => f.code !== 'HTEST' && f.code !== 'UNI')
        .map(f => ({
          key: f.code,
          text: f.name[lang],
        })),
    [faculties, lang],
  )

  return (
    <>
      {filteredFaculties.map(faculty => (
        <Link key={faculty.key} to={`/faculty-monitoring/form/${form}/${faculty.key}`}>
          {faculty.text} {faculty.key}
        </Link>
      ))}
    </>
  )
}

export default FacultyMonitoringOverview
