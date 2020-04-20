import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import OwnerAccordionLinks from './OwnerAccordionLinks'
import OwnerAccordionUsers from './OwnerAccordionUsers'
import { getProgrammesUsersAction } from 'Utilities/redux/programmesUsersReducer'
import { getProgrammesTokensAction } from 'Utilities/redux/programmesTokensReducer'
import FormLocker from './FormLocker'

const OwnerAccordionContent = ({ programKey }) => {
  const dispatch = useDispatch()
  const [dataLoading, setDataLoading] = useState(false)
  const [dataReady, setDataReady] = useState(false)
  const usersPending = useSelector(({ programmesUsers }) => programmesUsers.pending)
  const tokensPending = useSelector(({ programmesTokens }) => programmesTokens.pending)

  useEffect(() => {
    setDataLoading(true)
    dispatch(getProgrammesUsersAction(programKey))
    dispatch(getProgrammesTokensAction(programKey))
  }, [])

  useEffect(() => {
    if (!usersPending && !tokensPending && dataLoading) {
      setDataReady(true)
      setDataLoading(false)
    }
  }, [usersPending, tokensPending])

  if (!dataReady) return null

  return (
    <>
      <FormLocker programme={programKey} />
      <OwnerAccordionLinks programme={programKey} />
      <OwnerAccordionUsers programme={programKey} />
    </>
  )
}

export default OwnerAccordionContent
