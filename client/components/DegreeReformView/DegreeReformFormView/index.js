import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { isAdmin } from '@root/config/common'
import { colors } from 'Utilities/common'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import NoPermissions from 'Components/Generic/NoPermissions'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import bigWheel from 'Assets/big_wheel.jpg'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { setViewOnly, getSingleProgrammesAnswers } from 'Utilities/redux/formReducer'
import Form from './DegreeReformForm'

import questions from '../../../koulutusuudistusQuestions.json'

const formShouldBeViewOnly = ({ accessToTempAnswers, programme, writeAccess, viewingOldAnswers, draftYear, year }) => {
  if (!accessToTempAnswers) return true
  if (programme.locked) return true
  if (!writeAccess) return true
  if (viewingOldAnswers) return true
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  return false
}

const DegreeReformFormView = ({ room }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  const allProgrammes = useSelector(state => state.studyProgrammes.data)
  const programme = Object.values(allProgrammes).find(p => p.key === room)

  const writeAccess = (user.access[room] && user.access[room].write) || isAdmin(user)
  const readAccess = (user.access[room] && user.access[room].read) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('degree-reform')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  const draftYear = useSelector(state => state.deadlines.draftYear)
  const singleProgramPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const year = 2023
  const viewingOldAnswers = useSelector(state => state.form.viewingOldAnswers)
  const currentRoom = useSelector(state => state.room)

  const accessToTempAnswers = user.yearsUserHasAccessTo.includes(year)

  useEffect(() => {
    document.title = `${t('form')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  useEffect(() => {
    if (!programme) return
    // form is now just a placeholder, 1 = vuosiseuranta
    dispatch(getSingleProgrammesAnswers({ room, year, form: 1 }))
    if (formShouldBeViewOnly({ accessToTempAnswers, programme, writeAccess, viewingOldAnswers, draftYear, year })) {
      dispatch(setViewOnly(true))
      if (currentRoom) {
        dispatch(wsLeaveRoom(room))
      }
    } else {
      dispatch(wsJoinRoom(room))
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

  if (!isAdmin(user)) return <Redirect to="/" />

  if (!room) return <Redirect to="/" />

  if (!readAccess && !writeAccess) return <NoPermissions t={t} />

  const targetURL = `/degree-reform/previous-years/${room}`

  const formType = 'degree-reform'

  return (
    <div className="form-container">
      <NavigationSidebar programmeKey={room} form="degree-reform" />
      <div className="the-form">
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <div style={{ marginBottom: '2em' }}>
              <Button onClick={() => history.push('/')} icon="arrow left" />
            </div>
            <img alt="form-header-calendar" className="img-responsive" src={bigWheel} />
          </div>
          <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('degree-reform')} 2023
          </h3>

          <p
            className="past-answers-link"
            style={{
              lineHeight: 2,
              backgroundColor: colors.background_blue,
              padding: '1.5em 0.5em',
              borderRadius: '5px',
              margin: '4em 0em 1em 0em',
            }}
          >
            <Link data-cy={`link-to-old-${room}-answers`} to={targetURL} target="_blank">
              <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Tarkastele kolmen edellisen vuoden vastauksia <Icon name="external" />{' '}
              </p>
            </Link>
          </p>
        </div>
        <Form form={formType} programmeKey={programme.key} questions={questions} />
      </div>
    </div>
  )
}

export default DegreeReformFormView
