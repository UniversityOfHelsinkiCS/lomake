import React from 'react'
import { useSelector } from 'react-redux'
import { basePath } from '../../../config/common'
import { Message } from 'semantic-ui-react'
import { usersPageTranslations as translations } from 'Utilities/translations'


export default function FacultyLinks() {
  const allTokens = useSelector((state) => state.accessToken.allTokens)
  const faculties = useSelector((state) => state.faculties.data)
  const language = useSelector((state) => state.language)

  if (!allTokens || !faculties || !language) return null

  const temp = faculties.map((faculty) => {
    const token = allTokens.find((t) => t.faculty === faculty.code && t.type === 'READ')
    const shareUrl = `${window.location.origin}${basePath}access/${token.url}`
    return {
      code: faculty.code,
      facultyName: faculty.name,
      shareUrl,
    }
  })

  return (
    <>
      <Message
        color="blue"
        icon="exclamation"
        content={translations.facultyMessage[language]}
      />
      <table>
        <thead>
          <tr>
            <th>{translations.code[language]}</th>
            <th>{translations.faculty[language]}</th>
            <th>{translations.shareUrl[language]}</th>
          </tr>
        </thead>
        <tbody>
          {temp.map((t) => {
            const { code, facultyName, shareUrl } = t
            return (
              <tr key={facultyName}>
                <td>{code}</td>
                <td>{facultyName}</td>
                <td>{shareUrl}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
