/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Button, Loader } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import rypsiImage from '../../assets/rypsi.jpg'
import NoPermissions from '../Generic/NoPermissions'
import YearSelector from '../Generic/YearSelector'
import FormStatusMessage from '../Generic/FormStatusMessage'
import { wsJoinRoom, wsLeaveRoom } from '../../redux/websocketReducer'
import { getProgramme } from '../../redux/studyProgrammesReducer'
import { setViewOnly, getSingleProgrammesAnswers } from '../../redux/formReducer'
import { colors, getFormViewRights } from '../../util/common'
import { hasSomeReadAccess, isAdmin } from '../../../config/common'
import { formKeys } from '../../../config/data'
import StatusMessage from './StatusMessage'

import SaveIndicator from './SaveIndicator'
import NavigationSidebar from './NavigationSidebar'
import Form from './Form'
import { yearlyQuestions as questions } from '../../questionData'
import Downloads from './Downloads'
import './FormView.scss'

const FormView = () => {
  const { room } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const componentRef = useRef()

  const form = formKeys.YEARLY_ASSESSMENT

  const lang = useSelector(state => state.language)
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === form) : null
  const programme = useSelector(state => state.studyProgrammes.singleProgram)
  const singleProgramPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const user = useSelector(state => state.currentUser.data)
  const year = useSelector(state => state.filters.year)
  const viewingOldAnswers = useSelector(state => state.form.viewingOldAnswers)
  const currentRoom = useSelector(state => state.room)

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const writeAccess = user.access[room]?.write || isAdmin(user)
  const readAccess = hasSomeReadAccess(user) || isAdmin(user)

  const accessToTempAnswers = user.yearsUserHasAccessTo.includes(year)

  useEffect(() => {
    document.title = `${t('form')} - ${room}`
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

  if (!room) return <Navigate to="/" />

  if (!programme && !singleProgramPending) return 'Error: Invalid url.'
  if (!readAccess && !writeAccess) return <NoPermissions requestedForm={t('form')} t={t} />

  return singleProgramPending || !programme ? (
    <Loader active />
  ) : (
    <div className="form-container">
      <NavigationSidebar programmeKey={programme.key} />
      <div className="the-form" ref={componentRef}>
        <FormStatusMessage form={form} programme={room} />
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <SaveIndicator />
            <div style={{ marginBottom: '2em' }}>
              <Button icon="arrow left" onClick={() => navigate('/yearly')} />
            </div>
            <img alt="form-header-rypsi" className="img-responsive" src={rypsiImage} />
          </div>

          <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
          <h3 data-cy="formview-title" style={{ marginTop: '0' }}>
            {t('formView:title')} {year}
          </h3>

          <div className="hide-in-print-mode">
            <YearSelector size="small" />
            <StatusMessage form={form} writeAccess={writeAccess} />

            <p>{t('formView:info1')}</p>
            <p style={{ marginBottom: '10px' }}>{t('formView:info2')}</p>
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
        <Downloads componentRef={componentRef} form={form} programme={programme} />
        <Form form={form} programmeKey={programme.key} questions={questions} />
      </div>
    </div>
  )
}

export default FormView
