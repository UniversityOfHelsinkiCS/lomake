import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import libaryImage from 'Assets/library.jpg'
import { Link } from 'react-router-dom'
import { colors } from 'Utilities/common'
import { Redirect } from 'react-router'

import { facultyMonitoringQuestions as questions } from '@root/client/questionData/index'
import { Button } from 'semantic-ui-react'
import { wsJoinRoom } from 'Utilities/redux/websocketReducer'
import StatusMessage from 'Components/FormView/StatusMessage'
import { isAdmin } from '@root/config/common'
import NoPermissions from 'Components/Generic/NoPermissions'
import FacultyLevelForm from './FacultyLevelForm'

const FacultyMonitoringForm = ({ room }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const faculty = faculties ? faculties.find(f => f.code === room) : null
  const form = formKeys.FACULTY_MONITORING
  const year = 2024
  const user = useSelector(state => state.currentUser.data)
  const hasWriteRights = (user.access[faculty.code]?.write && user.specialGroup?.evaluationFaculty) || isAdmin(user)
  const hasReadRights = (user.access[faculty.code]?.read && user.specialGroup?.evaluationFaculty) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('facultymonitoring')} - ${room}`
    dispatch(wsJoinRoom(room, form))
  }, [faculty, lang, room])

  if (!user || !room) return <Redirect to="/" />

  if (!faculty) return 'Error: Invalid url.'

  if (!hasReadRights) {
    return <NoPermissions t={t} requestedForm={t('evaluation')} />
  }

  return (
    <div>
      <div className="form-container">
        <NavigationSidebar formType="faculty-monitoring" formNumber={form} programmeKey={room} />
        <div className="the-form">
          <div className="hide-in-print-mode">
            <div style={{ marginBottom: '2em' }}>
              <Button as={Link} to="/faculty-monitoring" icon="arrow left" />
            </div>
            <img alt="form-header-libary" className="img-responsive" src={libaryImage} />
          </div>
          <h1 style={{ color: colors.blue }}>{faculty.name[lang]}</h1>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('facultymonitoring')} {year}
          </h3>
          <div className="hide-in-print-mode">
            <StatusMessage form={form} writeAccess={hasWriteRights} />
            <p>{t('formView:infoMeta1')}</p>
            <p style={{ marginBottom: '10px' }}>{t('formView:infoMeta2')}</p>
            <p style={{ marginBottom: '10px' }}>{t('formView:infoMeta3')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="big-circle-red" />
            {t('urgent')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="big-circle-yellow" />
            {t('semiUrgent')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="big-circle-green" />
            {t('nonUrgent')}
          </div>
          <FacultyLevelForm room={room} questions={questions} faculty={faculty} form={form} />
        </div>
      </div>
    </div>
  )
}

export default FacultyMonitoringForm
