import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProgrammesUsersAction } from 'Utilities/redux/programmesUsersReducer'
import ProgramControlsUsers from './ProgramControlsUsers'
import FormLocker from './FormLocker'

const OwnerAccordionContent = ({ programKey }) => {
  const dispatch = useDispatch()
  const [dataLoading, setDataLoading] = useState(false)
  const [dataReady, setDataReady] = useState(false)
  const usersPending = useSelector(({ programmesUsers }) => programmesUsers.pending)

  useEffect(() => {
    setDataLoading(true)
    dispatch(getProgrammesUsersAction(programKey))
  }, [])

  useEffect(() => {
    if (!usersPending && dataLoading) {
      setDataReady(true)
      setDataLoading(false)
    }
  }, [usersPending])

  if (!dataReady) return null

  return (
    <>
      <FormLocker programme={programKey} />
      <ProgramControlsUsers programme={programKey} />
    </>
  )
}

export default OwnerAccordionContent
