import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { wsConnect } from 'Utilities/redux/websocketReducer'

import Form from 'Components/FormView/Form'

const FormView = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // TODO: Connect based on the faculty we're looking at
    dispatch(wsConnect())
  }, [])

  return <Form />
}

export default FormView
