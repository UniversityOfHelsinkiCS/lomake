import React from 'react'
import { useSelector } from 'react-redux'
import { basePath } from '../../../config/common'
import { Message } from 'semantic-ui-react'

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
        content={
          'The links listed here give READ-permissions to all studyprogrammes under each faculty.'
        }
      />
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Faculty</th>
            <th>Share-URL</th>
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
