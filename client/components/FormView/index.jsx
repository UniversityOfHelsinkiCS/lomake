/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Button, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'
import rypsiImage from '../../assets/rypsi.jpg'
import NoPermissions from '../Generic/NoPermissions'
import YearSelector from '../Generic/YearSelector'
import { getProgramme } from '../../redux/studyProgrammesReducer'
import { getSingleProgrammesAnswers } from '../../redux/formReducer'
import { colors } from '../../util/common'
import { hasSomeReadAccess, isAdmin } from '../../../config/common'
import { formKeys } from '../../../config/data'
import StatusMessage from './StatusMessage'
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
  const programme = useSelector(state => state.studyProgrammes.singleProgram)
  const singleProgramPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const user = useSelector(state => state.currentUser.data)
  const year = useSelector(state => state.filters.year)
  const readAccess = hasSomeReadAccess(user) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('form')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  useEffect(() => {
    if (!programme) return
    dispatch(getSingleProgrammesAnswers({ room, year, form }))
  }, [programme, year, form, room])

  useEffect(() => {
    return () => {
      dispatch({ type: 'RESET_STUDYPROGRAM_SUCCESS' })
    }
  }, [])

  if (!room) return <Navigate to="/" />
  if (!programme && !singleProgramPending) return 'Error: Invalid url.'
  if (!readAccess) return <NoPermissions requestedForm={t('form')} t={t} />

  return singleProgramPending || !programme ? (
    <CircularProgress />
  ) : (
    <div className="form-container">
      <NavigationSidebar programmeKey={programme.key} />
      <div className="the-form" ref={componentRef}>
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <div style={{ marginBottom: '2em' }}>
              <Button
                aria-label="back"
                onClick={() => navigate('/yearly')}
                size="large"
                startIcon={<ArrowBackIcon />}
              />
            </div>
            <img alt="form-header-rypsi" className="img-responsive" src={rypsiImage} />
          </div>

          <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
          <h3 data-cy="formview-title" style={{ marginTop: '0' }}>
            {t('formView:title')} {year}
          </h3>

          <div className="hide-in-print-mode">
            <YearSelector size="small" />
            <StatusMessage />

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
