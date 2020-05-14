import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTokens } from 'Utilities/redux/accessTokenReducer'
import { basePath } from '../../../config/common'

export default function OwnerLinks() {
  const dispatch = useDispatch()
  const [showLinks, setShowLinks] = useState(false)
  const allTokens = useSelector((state) => state.accessToken.allTokens)
  const studyProgrammes = useSelector((state) => state.studyProgrammes.data)
  const language = useSelector((state) => state.language)

  useEffect(() => {
    dispatch(getAllTokens())
  }, [])

  if (!allTokens || !studyProgrammes) return null

  const sortedTokens = allTokens.sort((a, b) => a.programme.localeCompare(b.programme))

  return (
    <div>
      <button onClick={() => setShowLinks(!showLinks)}>Toggle ownerlinks</button>
      {showLinks &&
        sortedTokens
          .filter((token) => token.type === 'ADMIN')
          .map((token) => {
            const code = token.url
            const programmeKey = token.programme
            const shareUrl = `${window.location.origin}${basePath}access/${code}`
            const localizedProgName = studyProgrammes.find((p) => p.key === programmeKey).name[
              language
            ]
            const content = `${programmeKey},\t(${localizedProgName}),\t${shareUrl}`

            return <pre key={code}>{content}</pre>
          })}
    </div>
  )
}
