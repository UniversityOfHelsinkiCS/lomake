/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useParams, useNavigate } from 'react-router'
import { getProgramme } from '../../../redux/studyProgrammesReducer'
import { useTranslation } from 'react-i18next'
import DownloadIcon from '@mui/icons-material/Download'
import { CircularProgress, IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { getSingleProgrammesAnswers } from '../../../redux/formReducer'
import { colors } from '../../../util/common'
import StatusMessage from '../../FormView/StatusMessage'
import powerlineImage from '../../../assets/APowerlineTower.jpg'
import NavigationSidebar from '../../FormView/NavigationSidebar'
import { formKeys } from '../../../../config/data'
import MetaEvaluationForm from './MetaEvaluationForm'
import { metareviewQuestions as questions } from '../../../questionData'

// tämä on samanlainen kuin Evaluationiew/EvaluationFormView/index.js

const ProgrammeLevelForm = () => {
  const { room } = useParams()
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const form = formKeys.META_EVALUATION
  const user = useSelector(state => state.currentUser.data)
  const programme = useSelector(state => state.studyProgrammes.singleProgram)
  const year = useSelector(({ filters }) => filters.year)
  const draftYear = null
  const viewingOldAnswers = useSelector(state => state.form.viewingOldAnswers)
  const accessToTempAnswers = user.yearsUserHasAccessTo.includes(year)
  const answers = useSelector(state => state.tempAnswers)

  useEffect(() => {
    document.title = `${t('evaluation')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  useEffect(() => {
    if (!programme) return
    dispatch(getSingleProgrammesAnswers({ room, year, form }))
  }, [programme, viewingOldAnswers, year, draftYear, accessToTempAnswers, room, user])

  if (!user || !room) return <Navigate to="/" />
  if (!programme || !answers) return <CircularProgress />

  const level = room.startsWith('T') ? 'doctoral' : 'kandimaisteri'
  const questionData = questions.filter(q => q.level === level)

  return (
    <div className="form-container">
      <NavigationSidebar formNumber={form} formType="meta-evaluation" programmeKey={room} questionData={questionData} />
      <div className="the-form">
        <div className="hide-in-print-mode">
          <div style={{ marginBottom: '2em' }}>
            <IconButton onClick={() => navigate(`/meta-evaluation`)} sx={{ marginRight: 2 }}>
              <ArrowBack data-cy="back-button" />
            </IconButton>
          </div>
          <img alt="form-header-calendar" className="img-responsive" src={powerlineImage} />
        </div>{' '}
        <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
        <h3 data-cy="formview-title" style={{ marginTop: '0' }}>
          {t('evaluation')} {year}
        </h3>
        <h5 data-cy="formview-subtitle" style={{ marginTop: '0' }}>
          {t('formView:metaSubtitle')}
        </h5>
        <div className="hide-in-print-mode">
          <StatusMessage />
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="big-circle-gray" />
          {t('irrelevant')}
        </div>
        <div className="info-container">
          <a href={t('formView:metaPdfUrl')} rel="noreferrer" target="_blank">
            <h4>
              {t('formView:metaPdfName')} <DownloadIcon fontSize="small" />{' '}
            </h4>
          </a>
        </div>
        <br />
        <MetaEvaluationForm
          form={form}
          programmeKey={programme.key}
          questions={questionData}
          summaryData={answers}
          summaryUrl={null}
        />
      </div>
    </div>
  )
}

export default ProgrammeLevelForm
