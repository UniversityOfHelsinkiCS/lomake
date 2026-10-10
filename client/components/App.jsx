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
import { formKeys } from '../../config/data'
import { loginAction } from '../redux/currentUserReducer'
import { getStudyProgrammes, getUsersProgrammes } from '../redux/studyProgrammesReducer'
import { getDeadlineAndDraftYear } from '../redux/deadlineReducer'
import { getFaculties } from '../redux/facultyReducer'
import { getAnswersAction } from '../redux/oldAnswersReducer'
import { setYear, setMultipleYears, setKeyDataYear } from '../redux/filterReducer'
import { setLanguage } from '../redux/languageReducer'
import { Footer } from './Footer'
import {
  ARCHIVE_LAST_YEAR,
  isDegreeStudentNotEmployee,
  isDegreeStudentOrEmployee,
  isEmployee,
} from '../../config/common'
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

const useSetupCurrentYear = ({ oldAnswers, deadlines, currentUser, dispatch, formKeys, setYear, setMultipleYears }) => {
  // TODO: deprecate this and set the year by form
  // When oldAnswers are ready, set default year based on deadline or most recent answers
  useEffect(() => {
    if (!oldAnswers.data) return

    let year = 2019

    // Check if there's an upcoming deadline for the yearly assessment
    const hasUpcomingDeadline =
      deadlines.draftYear &&
      deadlines.nextDeadline?.length > 0 &&
      new Date(deadlines.nextDeadline.find(d => d.form === formKeys.YEARLY_ASSESSMENT)?.date) >= new Date()

    if (hasUpcomingDeadline && currentUser?.data.yearsUserHasAccessTo.includes(deadlines.draftYear.year)) {
      year = deadlines.draftYear.year
    } else {
      // Find the most recent year with data but the max is 2024
      year = oldAnswers.data.reduce((latestYear, answer) => {
        const isRelevantForm = answer.form === formKeys.YEARLY_ASSESSMENT || answer.form === formKeys.META_EVALUATION
        if (
          Object.entries(answer.data).length > 0 &&
          answer.year > latestYear &&
          answer.year <= ARCHIVE_LAST_YEAR &&
          isRelevantForm
        ) {
          return answer.year
        }
        return latestYear
      }, 2019)
    }

    if (currentUser?.data.yearsUserHasAccessTo.includes(year)) {
      dispatch(setYear(year))
      dispatch(setMultipleYears([year]))
    }
  }, [oldAnswers, deadlines])
}

const App = () => {
  const isNotIndividualForm = !window.location.href.includes('/individual')
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const faculties = useSelector(state => state.faculties)
  const deadlines = useSelector(state => state.deadlines)
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
  useEffect(() => {
    const user = currentUser.data
    if (user && isEmployee(user)) {
      dispatch(getDeadlineAndDraftYear())
      dispatch(getFaculties())
      dispatch(getStudyProgrammes())
      if (isEmployee(user) && isNotIndividualForm) {
        dispatch(getUsersProgrammes())
        dispatch(getAnswersAction())
      }
    }
  }, [currentUser])

  useSetupCurrentYear({
    oldAnswers,
    deadlines,
    currentUser,
    dispatch,
    formKeys,
    setYear,
    setMultipleYears,
  })

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

  return (
    <Box className="v1" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontSize: 16 }}>
      {/* Uncomment/comment the banner to change its visibility */}
      <Banner />

      <NavBar />

      {showRouterForOldProgrammes || isDegreeStudentNotEmployee(currentUser.data) ? <Router /> : <CircularProgress />}
      <Footer />
    </Box>
  )
}

export default App
