import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getTokenAction,
  claimTokenAction
} from 'Utilities/redux/accessTokenReducer'

export default ({ url }) => {
  const dispatch = useDispatch()
  const token = useSelector((store) => store.accessToken)

  useEffect(() => {
    dispatch(getTokenAction(url))
  }, [])

  const handleClaim = () => {
    dispatch(claimTokenAction(url))
  }

  if (!token.data) return <>loading!</>

  return (
    <>
      You are about to claim token:
      <div>
        {token.data.programme}: {token.data.type}
      </div>
      <button onClick={() => handleClaim()}>Claim</button>
    </>
  )
}
