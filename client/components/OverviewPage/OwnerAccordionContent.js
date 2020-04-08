import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import OwnerAccordionLinks from './OwnerAccordionLinks'
import OwnerAccordionUsers from './OwnerAccordionUsers'
import { getProgrammesUsersAction } from 'Utilities/redux/programmesUsersReducer'
import { getProgrammesTokensAction } from 'Utilities/redux/programmesTokensReducer'

const OwnerAccordionContent = ({ program }) => {


  const dispatch = useDispatch()
  const [dataLoading, setDataLoading] = useState(false)
  const [dataReady, setDataReady] = useState(false)
  const usersPending = useSelector(({ programmesUsers }) => programmesUsers.pending)
  const tokensPending = useSelector(({ programmesTokens }) => programmesTokens.pending)


  useEffect(() => {
    setDataLoading(true)
    dispatch(getProgrammesUsersAction(program))
    dispatch(getProgrammesTokensAction(program))
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
      <OwnerAccordionLinks programme={program} />
      <OwnerAccordionUsers programme={program} />
    </>
  )
}

export default OwnerAccordionContent
