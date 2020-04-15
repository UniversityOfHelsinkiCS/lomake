import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { wsConnect } from 'Utilities/redux/websocketReducer'
import { loginAction } from 'Utilities/redux/currentUserReducer'
import NavBar from 'Components/NavBar'
import Router from 'Components/Router'
import { getStudyProgrammes } from 'Utilities/redux/studyProgrammesReducer'

export default () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.currentUser)
  const studyProgrammes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  useEffect(() => {
    dispatch(loginAction())
    dispatch(wsConnect())
    dispatch(getStudyProgrammes())
  }, [])

  if (!currentUser.data || !studyProgrammes) return null

  return (
    <div>
      <NavBar />
      <Router />
    </div>
  )
}
