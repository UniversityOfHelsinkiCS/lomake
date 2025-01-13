import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'
import { Loader } from 'semantic-ui-react'
import { isAdmin } from '@root/config/common'
import NoPermissions from 'Components/Generic/NoPermissions'
import MonitoringOverview from './MonitoringOverview'

const FacultyMonitoringOverview = () => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const form = formKeys.FACULTY_MONITORING
  const formType = 'faculty-evaluation'
  const user = useSelector(state => state.currentUser.data)

  const hasReadRights = (faculties, user) => {
    const readRights = faculties?.some(faculty => user.access[faculty.code]?.read)
    return readRights || user.specialGroup?.evaluationFaculty || isAdmin(user)
  }

  useEffect(() => {
    document.title = `${t('facultymonitoring')}`
  }, [lang, t])

  if (!hasReadRights(faculties, user)) {
    return <NoPermissions t={t} requestedForm={t('facultymonitoring')} />
  }

  if (faculties.pending) return <Loader active />

  return <MonitoringOverview t={t} lang={lang} faculties={faculties} form={form} formType={formType} />
}

export default FacultyMonitoringOverview
