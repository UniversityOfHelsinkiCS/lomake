import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getAnswersAction } from 'Utilities/redux/answersReducer'

export default () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAnswersAction())
  }, [])

  return <>here be table!</>
}
