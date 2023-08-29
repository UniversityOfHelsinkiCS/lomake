import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const studyProgrammes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const deadlines = useSelector(state => state.deadlines)
  const oldAnswers = useSelector(state => state.oldAnswers) // (({ oldAnswers }) => oldAnswers.data)
  const lang = useSelector(state => state.language)

  useEffect(() => {
    const linkLang = languageFromUrl()

    if (linkLang && lang !== linkLang && ['fi', 'se', 'en'].includes(linkLang)) {
      dispatch(setLanguage(linkLang))
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    dispatch(loginAction())
    dispatch(wsConnect())
    initShibbolethPinger(60000, null, true) // Errors are handled in lomake
  }, [])

  // Do this after user.data is ready, so that there wont be dupe users in db.
  // Because of accessControlMiddleware
  useEffect(() => {
    const user = currentUser.data
    if (user) {
      dispatch(getUsersProgrammes())
      dispatch(getStudyProgrammes())
      dispatch(getDeadlineAndDraftYear())
      dispatch(getFaculties())
      dispatch(getAnswersAction())
    }
  }, [currentUser])

  // When oldAnswers are ready, set default year based on deadline or most recent answers
  useEffect(() => {
    let year = 2019
    if (oldAnswers.data) {
      if (
        deadlines.draftYear &&
        deadlines?.nextDeadline?.length > 0 &&
        new Date(deadlines.nextDeadline.find(d => d.form === 1)?.date) >= new Date() &&
        currentUser.data.yearsUserHasAccessTo.includes(deadlines.draftYear.year)
      ) {
        year = deadlines.draftYear.year
      } else {
        year = oldAnswers.data.reduce((acc, answer) => {
          if (Object.entries(answer.data).length > 0 && answer.year > acc && answer.form === 1) return answer.year
          return acc
        }, 2019)
      }
      if (currentUser.data.yearsUserHasAccessTo.includes(year)) {
        dispatch(setYear(year))
        dispatch(setMultipleYears([year]))
      }
    }
  }, [oldAnswers, deadlines])

  if (!currentUser.data || !studyProgrammes || !oldAnswers || !oldAnswers.data) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Router />
      <Footer />
    </div>
  )
}
