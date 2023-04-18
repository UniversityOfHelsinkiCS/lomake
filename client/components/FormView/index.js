import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useHistory } from 'react-router'
import { Button, Loader } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import rypsiImage from 'Assets/rypsi.jpg'
import NoPermissions from 'Components/Generic/NoPermissions'
import YearSelector from 'Components/Generic/YearSelector'
import FormStatusMessage from 'Components/Generic/FormStatusMessage'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { setViewOnly, getSingleProgrammesAnswers } from 'Utilities/redux/formReducer'
import { colors } from 'Utilities/common'
import { isAdmin } from '@root/config/common'
import StatusMessage from './StatusMessage'
import SaveIndicator from './SaveIndicator'
import NavigationSidebar from './NavigationSidebar'
import Form from './Form'
import questions from '../../questions.json'
import Downloads from './Downloads'
import './FormView.scss'

const formShouldBeViewOnly = ({
  accessToTempAnswers,
  programme,
  writeAccess,
  viewingOldAnswers,
  draftYear,
  year,
  formDeadline,
  form,
}) => {
  if (!accessToTempAnswers) return true
  if (programme.locked) return true
  if (!writeAccess) return true
  if (viewingOldAnswers) return true
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  if (formDeadline?.form !== form) return true
  return false
}

const FormView = ({ room }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()

  const form = 1 // TO FIX or not?

  const lang = useSelector(state => state.language)
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === form) : null
  const programme = useSelector(state => state.studyProgrammes.singleProgram)
  const singleProgramPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const user = useSelector(state => state.currentUser.data)
  const year = useSelector(state => state.filters.year)
  const viewingOldAnswers = useSelector(state => state.form.viewingOldAnswers)
  const currentRoom = useSelector(state => state.room)

  const writeAccess = (user.access[room] && user.access[room].write) || isAdmin(user)
  const readAccess = (user.access[room] && user.access[room].read) || isAdmin(user)
  const accessToTempAnswers = user.yearsUserHasAccessTo.includes(year)

  useEffect(() => {
    document.title = `${t('form')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  useEffect(() => {
    if (!programme) return
    dispatch(getSingleProgrammesAnswers({ room, year, form }))
    if (
      formShouldBeViewOnly({
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

  useEffect(() => {
    return () => {
      dispatch(wsLeaveRoom(room))
      dispatch({ type: 'RESET_STUDYPROGRAM_SUCCESS' })
    }
  }, [])

  if (!room) return <Redirect to="/" />

  if (!programme && !singleProgramPending) return 'Error: Invalid url.'

  if (!readAccess && !writeAccess) return <NoPermissions t={t} />

  return singleProgramPending ? (
    <Loader active />
  ) : (
    <div className="form-container">
      <NavigationSidebar programmeKey={programme.key} />
      <div className="the-form">
        <FormStatusMessage programme={room} form={form} />
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <SaveIndicator />
            <div style={{ marginBottom: '2em' }}>
              <Button onClick={() => history.push('/')} icon="arrow left" />
            </div>
            <img alt="form-header-rypsi" className="img-responsive" src={rypsiImage} />
          </div>

          <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('formView:title')} {year}
          </h3>

          <div className="hide-in-print-mode">
            <YearSelector size="small" />
            <StatusMessage programme={room} form={form} />

            <p>{t('formView:info1')}</p>
            <p>{t('formView:info2')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="big-circle-green" />
            {t('positive')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="big-circle-yellow" />
            {t('neutral')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="big-circle-red" />
            {t('negative')}
          </div>
        </div>
        <Downloads programme={programme} />
        <Form programmeKey={programme.key} questions={questions} form={form} />
      </div>
    </div>
  )
}

export default FormView
