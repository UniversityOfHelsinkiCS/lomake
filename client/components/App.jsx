import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'

import { wsConnect } from 'Utilities/redux/websocketReducer'
import { loginAction } from 'Utilities/redux/currentUserReducer'
import NavBar from 'Components/NavBar'
import Router from 'Components/Router'
import { getStudyProgrammes, getUsersProgrammes } from 'Utilities/redux/studyProgrammesReducer'
import { getDeadlineAndDraftYear } from 'Utilities/redux/deadlineReducer'
import { getFaculties } from 'Utilities/redux/facultyReducer'
import { getAnswersAction } from 'Utilities/redux/oldAnswersReducer'
import { setYear, setMultipleYears } from 'Utilities/redux/filterReducer'
import { initShibbolethPinger } from 'unfuck-spa-shibboleth-session'
import { setLanguage } from 'Utilities/redux/languageReducer'
import { Loader } from 'semantic-ui-react'
import Footer from './Footer/Footer'

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

export default () => {
  const isNotIndividualForm = !window.location.href.includes('/individual')
  const isDegreeReformSummary =
    window.location.href.includes('/degree-reform') && window.location.search.startsWith('?faculty=')
  const isNotDegreeReformSummary = !isDegreeReformSummary
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const studyProgrammes = useSelector(state => state.studyProgrammes)
  const faculties = useSelector(state => state.faculties)
  const deadlines = useSelector(state => state.deadlines)
  const oldAnswers = useSelector(state => state.oldAnswers) // (({ oldAnswers }) => oldAnswers.data)
  const lang = useSelector(state => state.language)

  const { i18n } = useTranslation()

  useEffect(() => {
    const linkLang = languageFromUrl()

    if (linkLang && lang !== linkLang && ['fi', 'se', 'en'].includes(linkLang)) {
      dispatch(setLanguage(linkLang))
      i18n.changeLanguage(linkLang)
    }
  }, [])

  useEffect(() => {
    dispatch(loginAction())
    if (isNotIndividualForm && isNotDegreeReformSummary && !window.location.pathname.includes('/previous-years')) {
      dispatch(wsConnect())
    }

    initShibbolethPinger(60000, null, false) // Errors are handled in lomake
  }, [])

  // Do this after user.data is ready, so that there wont be dupe users in db.
  // Because of accessControlMiddleware
  useEffect(() => {
    const user = currentUser.data
    if (user) {
      dispatch(getDeadlineAndDraftYear())
      dispatch(getFaculties())
      dispatch(getStudyProgrammes())
      if (isNotIndividualForm) {
        dispatch(getUsersProgrammes())
        dispatch(getAnswersAction())
      }
    }
  }, [currentUser])

  // When oldAnswers are ready, set default year based on deadline or most recent answers
  useEffect(() => {
    if (!oldAnswers.data) return

    let year = 2019

    // Check if there's an upcoming deadline for the yearly assessment
    const hasUpcomingDeadline =
      deadlines.draftYear &&
      deadlines.nextDeadline?.length > 0 &&
      new Date(deadlines.nextDeadline.find(d => d.form === formKeys.YEARLY_ASSESSMENT)?.date) >= new Date()

    if (hasUpcomingDeadline && currentUser.data?.yearsUserHasAccessTo.includes(deadlines.draftYear.year)) {
      year = deadlines.draftYear.year
    } else {
      // Find the most recent year with data
      year = oldAnswers.data.reduce((latestYear, answer) => {
        const isRelevantForm = answer.form === formKeys.YEARLY_ASSESSMENT || answer.form === formKeys.META_EVALUATION
        if (Object.entries(answer.data).length > 0 && answer.year > latestYear && isRelevantForm) {
          return answer.year
        }
        return latestYear
      }, 2019)
    }

    if (currentUser.data?.yearsUserHasAccessTo.includes(year)) {
      dispatch(setYear(year))
      dispatch(setMultipleYears([year]))
    }
  }, [oldAnswers, deadlines])

  if (!currentUser.data) return null

  const isCommonDataReady = studyProgrammes?.data && oldAnswers?.data
  const isIndividualDataReady = studyProgrammes?.data && faculties?.data
  const showRouter = isNotIndividualForm ? isCommonDataReady : isIndividualDataReady

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      {showRouter ? <Router /> : <Loader active />}
      <Footer />
    </div>
  )
}
