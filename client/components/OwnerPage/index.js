import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProgrammesTokensAction } from 'Utilities/redux/programmesTokensReducer'

const findOwnedProgramme = (user) => {
  return Object.keys(user.access).find((programme) => user.access[programme].admin)
}

export default () => {
  const dispatch = useDispatch()
  const tokens = useSelector((store) => store.programmesTokens)
  const currentUser = useSelector((store) => store.currentUser)
  const programme = findOwnedProgramme(currentUser.data)

  useEffect(() => {
    dispatch(getProgrammesTokensAction(programme))
  }, [])

  if (!tokens.data) return <>loading!</>

  return (
    <>
      <h2>{programme}</h2>
      {tokens.data.map((token) => (
        <div key={token.url}>
          {token.type} {`https://study.cs.helsinki.fi/lomake/access/${token.url}`}
        </div>
      ))}
    </>
  )
}
