import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { wsConnect } from 'Utilities/redux/websocketReducer'
import { loginAction } from 'Utilities/redux/currentUserReducer'
import NavBar from 'Components/NavBar'
import Router from 'Components/Router'
import { getStudyProgrammes } from 'Utilities/redux/studyProgrammesReducer'
import { getDeadline } from 'Utilities/redux/deadlineReducer'
import { getFaculties } from 'Utilities/redux/facultyReducer'
import { getAnswersAction } from 'Utilities/redux/oldAnswersReducer'
import { initShibbolethPinger } from 'unfuck-spa-shibboleth-session'

export default () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.currentUser)
  const studyProgrammes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  useEffect(() => {
    dispatch(loginAction())
    dispatch(wsConnect())
    initShibbolethPinger(60000, null, true) // Errors are handled in lomake
  }, [])

  // Do this after user.data is ready, so that there wont be dupe users in db.
  // Because of accessControlMiddleware
  useEffect(() => {
    if (currentUser.data) {
      dispatch(getStudyProgrammes())
      dispatch(getDeadline())
      dispatch(getFaculties())
      dispatch(getAnswersAction())
    }
  }, [currentUser])

  if (!currentUser.data || !studyProgrammes) return null

  return (
    <div>
      <NavBar />
      <Router />
    </div>
  )
}
