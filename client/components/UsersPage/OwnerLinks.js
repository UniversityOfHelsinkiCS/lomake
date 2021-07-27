import React from 'react'
import { useSelector } from 'react-redux'
import { basePath } from '../../../config/common'
import { Message } from 'semantic-ui-react'
import { usersPageTranslations as translations } from 'Utilities/translations'


export default function OwnerLinks() {
  const allTokens = useSelector((state) => state.accessToken.allTokens)
  const studyProgrammes = useSelector((state) => state.studyProgrammes.data)
  const lang = useSelector((state) => state.language)

  if (!allTokens || !studyProgrammes) return null

  const filteredTokens = allTokens.filter((token) => token.programme && token.valid)
  const sortedTokens = filteredTokens.sort((a, b) => a.programme.localeCompare(b.programme))

  return (
    <>
      <Message
        color="blue"
        icon="exclamation"
        content={translations.ownerMessage[lang]}
      />
      <table>
        <thead>
          <tr>
            <th>{translations.code[lang]}</th>
            <th>{translations.faculty[lang]}</th>
            <th>{translations.shareUrl[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {sortedTokens
            .filter((token) => token.type === 'ADMIN')
            .map((token) => {
              const code = token.url
              const programmeKey = token.programme
              const shareUrl = `${window.location.origin}${basePath}access/${code}`
              const programmeName = studyProgrammes.find((p) => p.key === programmeKey).name[lang]

              return (
                <tr key={token.url}>
                  <td>{programmeKey}</td>
                  <td>{programmeName}</td>
                  <td>{shareUrl}</td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </>
  )
}
