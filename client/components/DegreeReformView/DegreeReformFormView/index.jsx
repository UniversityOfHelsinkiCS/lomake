/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useParams } from 'react-router'
import StatusMessage from '../../FormView/StatusMessage'
import { hasSomeReadAccess, isAdmin } from '../../../../config/common'
import { colors, getYearToShow } from '../../../util/common'
import { getProgramme } from '../../../redux/studyProgrammesReducer'
import NoPermissions from '../../Generic/NoPermissions'
import NavigationSidebar from '../../FormView/NavigationSidebar'
import bigWheel from '../../../assets/big_wheel.jpg'
import { getSingleProgrammesAnswers } from '../../../redux/formReducer'
import DegreeReformForm from './ProgramForm'

import { degreeReformIndividualQuestions as questionData } from '../../../questionData'

const DegreeReformFormView = () => {
  const { room } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  const form = 2
  const allProgrammes = useSelector(state => state.studyProgrammes.data)
  const programme = Object.values(allProgrammes).find(p => p.key === room)
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const year = getYearToShow({ draftYear, nextDeadline, form })
  const readAccess = hasSomeReadAccess(user) || isAdmin(user)
  const questionDataFiltered = questionData.filter(q => q.id !== 0)

  useEffect(() => {
    document.title = `${t('degree-reform')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  useEffect(() => {
    if (!programme || !form) return
    dispatch(getSingleProgrammesAnswers({ room, year, form }))
  }, [programme, form, year, readAccess, room, user])

  if (!room) return <Navigate to="/" />

  if (!readAccess) return <NoPermissions requestedForm={t('degree-reform')} t={t} />

  const formType = 'degree-reform'
  return (
    <div className="form-container" data-cy="reform-form-group-container">
      <NavigationSidebar formType={formType} programmeKey={room} questionData={questionDataFiltered} />
      <div className="the-form">
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <div style={{ marginBottom: '2em' }}>
              <IconButton onClick={() => navigate(`/degree-reform'}`)} sx={{ marginRight: 2 }}>
                <ArrowBack data-cy="back-button" />
              </IconButton>
            </div>
            <img alt="form-header-calendar" className="img-responsive" src={bigWheel} />
          </div>
          <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
          <h3 data-cy="formview-title" style={{ marginTop: '0' }}>
            {t('degree-reform')}
          </h3>
          <StatusMessage />
        </div>
        <DegreeReformForm formType={formType} programmeKey={programme.key} questionData={questionDataFiltered} />
        <div style={{ height: '10em' }} />
      </div>
    </div>
  )
}

export default DegreeReformFormView
