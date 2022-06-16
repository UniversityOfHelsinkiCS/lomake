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

export default () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const studyProgrammes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const deadlines = useSelector(state => state.deadlines)
  const oldAnswers = useSelector(state => state.oldAnswers) // (({ oldAnswers }) => oldAnswers.data)

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
      const defaultYear = user.yearsUserHasAccessTo ? user.yearsUserHasAccessTo[0] : 2022
      dispatch(getUsersProgrammes())
      dispatch(getStudyProgrammes())
      dispatch(getDeadlineAndDraftYear())
      dispatch(getFaculties())
      dispatch(getAnswersAction())
      dispatch(setYear(defaultYear))
      dispatch(setMultipleYears([defaultYear]))
    }
  }, [currentUser])

  // When oldAnswers are ready, check if default year should be something else
  useEffect(() => {
    if (oldAnswers.data) {
      if (
        deadlines.nextDeadline &&
        new Date(deadlines.nextDeadline.date) >= new Date() &&
        currentUser.data.yearsUserHasAccessTo.includes(deadlines.draftYear.year)
      ) {
        dispatch(setYear(deadlines.draftYear.year))
        dispatch(setMultipleYears([deadlines.draftYear.year]))
      } else {
        const yearWithAnswers = oldAnswers.data.reduce((acc, answer) => {
          if (Object.entries(answer.data).length > 0 && answer.year > acc) return answer.year
          return acc
        }, 2019)
        dispatch(setYear(yearWithAnswers))
        dispatch(setMultipleYears([yearWithAnswers]))
      }
    }
  }, [oldAnswers])

  if (!currentUser.data || !studyProgrammes) return null

  return (
    <div>
      <NavBar />
      <Router />
    </div>
  )
}
