import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'
import MonitoringOverview from './MonitoringOverview'

const FacultyMonitoringOverview = () => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const form = formKeys.FACULTY_MONITORING
  const formType = 'faculty-evaluation'

  useEffect(() => {
    document.title = `${t('facultymonitoring')}`
  }, [lang, t])

  return <MonitoringOverview t={t} lang={lang} faculties={faculties} form={form} formType={formType} />
}

export default FacultyMonitoringOverview
