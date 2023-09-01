import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'
import StatusMessage from 'Components/FormView/StatusMessage'
import SaveIndicator from 'Components/FormView/SaveIndicator'

import { hasSomeReadAccess, isAdmin } from '@root/config/common'
import { colors, getFormViewRights } from 'Utilities/common'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import NoPermissions from 'Components/Generic/NoPermissions'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import bigWheel from 'Assets/big_wheel.jpg'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { setViewOnly, getSingleProgrammesAnswers } from 'Utilities/redux/formReducer'

import DegreeReformForm from './ProgramForm'

import { degreeReformIndividualQuestions as questionData } from '../../../questionData'

const DegreeReformFormView = ({ room }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)

  const form = 2

  const allProgrammes = useSelector(state => state.studyProgrammes.data)
  const programme = Object.values(allProgrammes).find(p => p.key === room)
  const singleProgramPending = useSelector(state => state.studyProgrammes.singleProgramPending)

  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === form) : null
  const currentRoom = useSelector(state => state.room)
  const year = 2023

  const writeAccess = (user.access[room] && user.access[room].write) || isAdmin(user)
  const readAccess = hasSomeReadAccess(user) || isAdmin(user)
  const accessToTempAnswers = user.yearsUserHasAccessTo.includes(year)
  const viewingOldAnswers = false

  const questionDataFiltered = questionData.filter(q => q.id !== 0)

  useEffect(() => {
    document.title = `${t('degree-reform')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  useEffect(() => {
    if (!programme || !form) return
    dispatch(getSingleProgrammesAnswers({ room, year, form }))
    if (
      getFormViewRights({
        accessToTempAnswers,
        programme,
        writeAccess,
        viewingOldAnswers,
        draftYear,
        year,
        formDeadline,
        form,
      })
    ) {
      dispatch(setViewOnly(true))
      if (currentRoom) dispatch(wsLeaveRoom(room))
    } else {
      dispatch(wsJoinRoom(room, form))
      dispatch(setViewOnly(false))
    }
  }, [
    programme,
    singleProgramPending,
    writeAccess,
    viewingOldAnswers,
    year,
    draftYear,
    accessToTempAnswers,
    readAccess,
    room,
    user,
  ])

  if (!room) return <Redirect to="/" />

  if (!readAccess && !writeAccess) return <NoPermissions t={t} />

  const formType = 'degree-reform'
  return (
    <div className="form-container" data-cy="reform-form-group-container">
      <NavigationSidebar programmeKey={room} formType={formType} questionData={questionDataFiltered} />
      <div className="the-form">
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <div style={{ marginBottom: '2em' }}>
              <Button onClick={() => history.push('/degree-reform')} icon="arrow left" />
            </div>
            <img alt="form-header-calendar" className="img-responsive" src={bigWheel} />
          </div>
          <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('degree-reform')}
          </h3>
          <StatusMessage programme={programme} form={form} />
          <SaveIndicator />
        </div>
        <DegreeReformForm formType={formType} programmeKey={programme.key} questionData={questionDataFiltered} />
        <div style={{ height: '10em' }} />
      </div>
    </div>
  )
}

export default DegreeReformFormView
