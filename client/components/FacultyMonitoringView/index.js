import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'

const FacultyMonitoringOverview = () => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties)
  const form = formKeys.FACULTY_EVALUATION
  const formType = 'faculty-evaluation'

  useEffect(() => {
    document.title = `${t('facultymonitoring')}`
  }, [lang, t])

  return <a href="form/8/H57">to form</a>
}

export default FacultyMonitoringOverview
