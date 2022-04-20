import React from 'react'
import { useSelector } from 'react-redux'
import { Message, Table } from 'semantic-ui-react'
import { usersPageTranslations as translations } from 'Utilities/translations'
import { basePath } from '../../../config/common'

export default function FacultyLinks() {
  const allTokens = useSelector(state => state.accessToken.allTokens)
  const faculties = useSelector(state => state.faculties.data)
  const lang = useSelector(state => state.language)

  if (!allTokens || !faculties || !lang) return null

  const temp = faculties.map(faculty => {
    const token = allTokens.find(t => t.faculty === faculty.code && t.type === 'READ')
    const shareUrl = token ? `${window.location.origin}${basePath}access/${token.url}` : 'token missing!'
    return {
      code: faculty.code,
      facultyName: faculty.name[lang],
      shareUrl,
    }
  })

  return (
    <>
      <Message color="blue" icon="exclamation" content={translations.facultyMessage[lang]} />
      <Table compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{translations.code[lang]}</Table.HeaderCell>
            <Table.HeaderCell>{translations.faculty[lang]}</Table.HeaderCell>
            <Table.HeaderCell>{translations.shareUrl[lang]}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {temp.map(t => {
            const { code, facultyName, shareUrl } = t
            return (
              <Table.Row key={facultyName}>
                <Table.Cell>{code}</Table.Cell>
                <Table.Cell>{facultyName}</Table.Cell>
                <Table.Cell>{shareUrl}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </>
  )
}
