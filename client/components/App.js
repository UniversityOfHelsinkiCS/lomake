import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { wsConnect } from 'Utilities/redux/websocketReducer'
import { loginAction } from 'Utilities/redux/currentUserReducer'
import NavBar from 'Components/NavBar'
import ReformIndividualNavBar from 'Components/ReformIndividualNavBar'
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
        deadlines.nextDeadlines &&
        new Date(deadlines.nextDeadlines[0].date) >= new Date() &&
        currentUser.data.yearsUserHasAccessTo.includes(deadlines.draftYear.year)
      ) {
        year = deadlines.draftYear.year
      } else {
        year = oldAnswers.data.reduce((acc, answer) => {
          if (Object.entries(answer.data).length > 0 && answer.year > acc) return answer.year
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
    <div>
      {window.location.pathname.substring(1).split('/')[0] === 'degree-reform-individual' ? (
        <NavBar />
      ) : (
        <ReformIndividualNavBar />
      )}
      <Router />
    </div>
  )
}
