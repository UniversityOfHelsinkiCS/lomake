import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { wsConnect } from 'Utilities/redux/websocketReducer'
import { loginAction } from 'Utilities/redux/currentUserReducer'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'

export default () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.currentUser)

  useEffect(() => {
    dispatch(loginAction())
    dispatch(wsConnect())
  }, [])

  if (!currentUser.data) return null

  return (
    <div>
      <NavBar />
      <Router />
      <Footer />
    </div>
  )
}
