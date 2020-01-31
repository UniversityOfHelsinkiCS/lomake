import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { wsConnect } from 'Utilities/redux/websocketReducer'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'

export default () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(wsConnect())
  }, [])
  return (
    <div>
      <NavBar />
      <Router />
      <Footer />
    </div>
  )
}