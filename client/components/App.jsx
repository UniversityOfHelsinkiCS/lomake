import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { initShibbolethPinger } from 'unfuck-spa-shibboleth-session'
import { Loader } from 'semantic-ui-react'
import { Box } from '@mui/material'
import NavBar from './NavBar'
import Router from './Router'
import { formKeys } from '../../config/data'

import { wsConnect } from '../redux/websocketReducer'
import { useGetAuthUserQuery } from '../redux/auth'
import { getStudyProgrammes, getUsersProgrammes } from '../redux/studyProgrammesReducer'
import { getDeadlineAndDraftYear } from '../redux/deadlineReducer'
import { getFaculties } from '../redux/facultyReducer'
import { getAnswersAction } from '../redux/oldAnswersReducer'
import { setYear, setMultipleYears, setKeyDataYear } from '../redux/filterReducer'
import { setLanguage } from '../redux/languageReducer'
import Footer from './Footer'
import { ARCHIVE_LAST_YEAR } from '../../config/common'

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

const useSetupCurrentYear = ({ oldAnswers, deadlines, yearsUserHasAccessTo, dispatch, formKeys, setYear, setMultipleYears }) => {
  // TODO: deprecate this and set the year by form
  // When oldAnswers are ready, set default year based on deadline or most recent answers
  useEffect(() => {
    if (!oldAnswers.data || !yearsUserHasAccessTo) return

    let year = 2019

    // Check if there's an upcoming deadline for the yearly assessment
    const hasUpcomingDeadline =
      deadlines.draftYear &&
      deadlines.nextDeadline?.length > 0 &&
      new Date(deadlines.nextDeadline.find(d => d.form === formKeys.YEARLY_ASSESSMENT)?.date) >= new Date()

    if (hasUpcomingDeadline && currentUser.data?.yearsUserHasAccessTo.includes(deadlines.draftYear.year)) {
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

    if (yearsUserHasAccessTo.includes(year)) {
      dispatch(setYear(year))
      dispatch(setMultipleYears([year]))
    }
  }, [oldAnswers, deadlines])
}

export default () => {
  const isNotIndividualForm = !window.location.href.includes('/individual')
  const isDegreeReformSummary =
    window.location.href.includes('/degree-reform') && window.location.search.startsWith('?faculty=')
  const isNotDegreeReformSummary = !isDegreeReformSummary
  const dispatch = useDispatch()
  // const currentUser = useSelector(state => state.currentUser)
  const studyProgrammes = useSelector(state => state.studyProgrammes)
  const faculties = useSelector(state => state.faculties)
  const deadlines = useSelector(state => state.deadlines)
  const oldAnswers = useSelector(state => state.oldAnswers) // (({ oldAnswers }) => oldAnswers.data)
  const lang = useSelector(state => state.language)
  const { isLoading, isFetching, yearsUserHasAccessTo } = useGetAuthUserQuery()

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
    if (isNotIndividualForm && isNotDegreeReformSummary && !window.location.pathname.includes('/previous-years')) {
      dispatch(wsConnect())
    }

    initShibbolethPinger(60000, null, false) // Errors are handled in lomake
  }, [])

  // Do this after user.data is ready, so that there wont be dupe users in db.
  // Because of accessControlMiddleware
  useEffect(() => {
    if (isLoading) {
      dispatch(getDeadlineAndDraftYear())
      dispatch(getFaculties())
      dispatch(getStudyProgrammes())
      if (isNotIndividualForm) {
        dispatch(getUsersProgrammes())
        dispatch(getAnswersAction())
      }
    }
  }, [isLoading])

  useSetupCurrentYear({
    oldAnswers,
    deadlines,
    yearsUserHasAccessTo,
    dispatch,
    formKeys,
    setYear,
    setMultipleYears,
  })

  if (isLoading || isFetching) return null

  const isCommonDataReady = studyProgrammes?.data && oldAnswers?.data
  const isIndividualDataReady = studyProgrammes?.data && faculties?.data
  const showRouter = isNotIndividualForm ? isCommonDataReady : isIndividualDataReady

  return (
    <Box className="v1" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontSize: 16 }}>
      <NavBar />

      {showRouter ? <Router /> : <Loader active />}
      <Footer />
    </Box>
  )
}
