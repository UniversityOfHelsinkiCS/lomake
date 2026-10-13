/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { initShibbolethPinger } from 'unfuck-spa-shibboleth-session'
import { Box, CircularProgress } from '@mui/material'
import NavBar from './NavBar'
import Router from './Router'
import { Banner } from './Banner'
import { loginAction } from '../redux/currentUserReducer'
import { getStudyProgrammes, getUsersProgrammes } from '../redux/studyProgrammesReducer'
import { getDeadlineAndDraftYear } from '../redux/deadlineReducer'
import { getFaculties } from '../redux/facultyReducer'
import { getAnswersActionAll } from '../redux/oldAnswersReducer'
import { setKeyDataYear } from '../redux/filterReducer'
import { setLanguage } from '../redux/languageReducer'
import { Footer } from './Footer'
import { isDegreeStudentNotEmployee, isDegreeStudentOrEmployee, isEmployee } from '../../config/common'
import NoPermissions from './Generic/NoPermissions'

const languageFromUrl = () => {
  const url = window.location.href
  const langStart = url.indexOf('lang=')
  if (langStart === -1) {
    return undefined
  }

  let linkLang = url.substring(langStart + 5)
  const langEnd = linkLang.indexOf('&')
  if (langEnd !== -1) {
    linkLang = linkLang.substring(0, langEnd)
  }

  if (['fi', 'se', 'en'].includes(linkLang)) {
    return linkLang
  }
  return undefined
}

const App = () => {
  const isNotIndividualForm = !window.location.href.includes('/individual')
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const faculties = useSelector(state => state.faculties)
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()
  const studyProgrammes = useSelector(state => state.studyProgrammes)
  const oldAnswers = useSelector(state => state.oldAnswers) // (({ oldAnswers }) => oldAnswers.data)
  const { i18n } = useTranslation()

  useEffect(() => {
    const linkLang = languageFromUrl()

    if (linkLang && lang !== linkLang && ['fi', 'se', 'en'].includes(linkLang)) {
      dispatch(setLanguage(linkLang))
      i18n.changeLanguage(linkLang)
    }

    // TODO: Define policy for default year
    // Currently sets the default year to the current year
    dispatch(setKeyDataYear(new Date().getFullYear().toString()))
  }, [])

  useEffect(() => {
    dispatch(loginAction())

    initShibbolethPinger(60000, null, false) // Errors are handled in lomake
  }, [])

  // Do this after user.data is ready, so that there wont be dupe users in db.
  // Because of accessControlMiddleware
  // TODO: check which routes should work with jory
  // without employee and fix accordingly
  useEffect(() => {
    const user = currentUser.data
    if (user && isEmployee(user)) {
      dispatch(getDeadlineAndDraftYear())
      dispatch(getFaculties())
      dispatch(getStudyProgrammes())
      if (isEmployee(user) && isNotIndividualForm) {
        dispatch(getUsersProgrammes())
        dispatch(getAnswersActionAll())
      }
    }
  }, [currentUser])

  if (!currentUser.data) {
    return <div data-cy="no-permissions-message" />
  }

  const isCommonDataReady = studyProgrammes?.data && oldAnswers?.data
  const isIndividualDataReady = studyProgrammes?.data && faculties?.data
  const showRouterForOldProgrammes = isNotIndividualForm ? isCommonDataReady : isIndividualDataReady
  const isStudentOrEmployee = currentUser.data && isDegreeStudentOrEmployee(currentUser.data)
  if (!isStudentOrEmployee) {
    return (
      <>
        <NavBar />
        <NoPermissions requestedForm={t('landingPage:yearlyAssessmentTitle')} t={t} />
        <div data-cy="no-permissions-message" />
      </>
    )
  }
  const showBanner = false
  return (
    <Box className="v1" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontSize: 16 }}>
      {/* Uncomment/comment the banner to change its visibility */}
      {showBanner && <Banner />}
      <NavBar />
      {showRouterForOldProgrammes || isDegreeStudentNotEmployee(currentUser.data) ? <Router /> : <CircularProgress />}
      <Footer />
    </Box>
  )
}

export default App
