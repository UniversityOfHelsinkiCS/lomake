import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useHistory } from 'react-router'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { useTranslation } from 'react-i18next'
import { Loader, Button } from 'semantic-ui-react'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { setViewOnly, getSingleProgrammesAnswers } from 'Utilities/redux/formReducer'
import { getFormViewRights, colors } from 'Utilities/common'
import { isAdmin } from '@root/config/common'
import StatusMessage from 'Components/FormView/StatusMessage'
import calendarImage from 'Assets/calendar.jpg'
import SaveIndicator from 'Components/FormView/SaveIndicator'

import MetaEvaluationForm from './MetaEvaluationForm'

import { metareviewQuestions as questions } from '../../../questionData'
// tämä on samanlainen kuin Evaluationiew/EvaluationFormView/index.js

const form = 7

const ProgrammeLevelForm = ({ room }) => {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const currentRoom = useSelector(state => state.room)
  const programme = useSelector(state => state.studyProgrammes.singleProgram)
  const history = useHistory()
  const year = 2024
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === form) : null
  const viewingOldAnswers = useSelector(state => state.form.viewingOldAnswers)
  const writeAccess = (user.access[room] && user.access[room].write) || isAdmin(user)
  const accessToTempAnswers = user.yearsUserHasAccessTo.includes(year)
  const answers = useSelector(state => state.tempAnswers)

  useEffect(() => {
    document.title = `${t('evaluation')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  useEffect(() => {
    if (!programme) return
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
  }, [programme, writeAccess, viewingOldAnswers, year, draftYear, accessToTempAnswers, room, user])

  if (!user || !room) return <Redirect to="/" />
  if (!programme || !answers) return <Loader active inline="centered" />

  return (
    <div className="form-container">
      <div className="the-form">
        <div className="hide-in-print-mode">
          <SaveIndicator />
          <div style={{ marginBottom: '2em' }}>
            <Button onClick={() => history.push('/meta-evaluation')} icon="arrow left" />
          </div>
          <img alt="form-header-calendar" className="img-responsive" src={calendarImage} />
        </div>{' '}
        <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
        <h3 style={{ marginTop: '0' }} data-cy="formview-title">
          {t('evaluation')} {year}
        </h3>
        <div className="hide-in-print-mode">
          <StatusMessage form={form} writeAccess={writeAccess} />
        </div>
        <MetaEvaluationForm
          questions={questions}
          programmeKey={programme.key}
          summaryData={answers}
          form={form}
          summaryUrl={null}
        />
      </div>
    </div>
  )
}

export default ProgrammeLevelForm
