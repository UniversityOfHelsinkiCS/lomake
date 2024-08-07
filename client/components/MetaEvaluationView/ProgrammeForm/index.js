import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { useTranslation } from 'react-i18next'
import { Loader, Button } from 'semantic-ui-react'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { setViewOnly, getSingleProgrammesAnswers } from 'Utilities/redux/formReducer'
import { getFormViewRights, colors } from 'Utilities/common'
import { isAdmin } from '@root/config/common'
import StatusMessage from 'Components/FormView/StatusMessage'
import powerlineImage from 'Assets/APowerlineTower.png'
import SaveIndicator from 'Components/FormView/SaveIndicator'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'

import { formKeys } from '@root/config/data'
import MetaEvaluationForm from './MetaEvaluationForm'

import { metareviewQuestions, metareviewDoctoralQuestions } from '../../../questionData'
// tämä on samanlainen kuin Evaluationiew/EvaluationFormView/index.js

const ProgrammeLevelForm = ({ room }) => {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const form = formKeys.META_EVALUATION
  const user = useSelector(state => state.currentUser.data)
  const currentRoom = useSelector(state => state.room)
  const programme = useSelector(state => state.studyProgrammes.singleProgram)
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

  const questions = room.startsWith('T') ? metareviewDoctoralQuestions : metareviewQuestions
  const level = room.startsWith('T') ? 'tohtori' : 'kandimaisteri'
  const questionData = questions.filter(q => q.level === level)

  return (
    <div className="form-container">
      <NavigationSidebar programmeKey={room} formType="meta-evaluation" formNumber={form} questionData={questionData} />
      <div className="the-form">
        <div className="hide-in-print-mode">
          <SaveIndicator />
          <div style={{ marginBottom: '2em' }}>
            <Button as={Link} to="/meta-evaluation" icon="arrow left" />
          </div>
          <img alt="form-header-calendar" className="img-responsive" src={powerlineImage} />
        </div>{' '}
        <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
        <h3 style={{ marginTop: '0' }} data-cy="formview-title">
          {t('evaluation')} {year}
        </h3>
        <div className="hide-in-print-mode">
          <StatusMessage form={form} writeAccess={writeAccess} />
          <p>{t('formView:infoMeta1')}</p>
          <p style={{ marginBottom: '10px' }}>{t('formView:infoMeta2')}</p>
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="big-circle-gray" />
          {t('irrelevant')}
        </div>
        <MetaEvaluationForm
          questions={questionData}
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
