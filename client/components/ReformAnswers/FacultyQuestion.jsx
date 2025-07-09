/* eslint-disable no-restricted-syntax */
import { useGetOrganisationDataQuery } from '@/client/redux/organisation'
import React from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
// import { useTranslation } from 'react-i18next'

const Question = ({ question, answers }) => {
  const lang = useSelector(state => state.language)
  const { data } = useGetOrganisationDataQuery()
  // const { t } = useTranslation()

  const { id } = question

  const faculties = {}

  for (const answer of answers) {
    const faculty = answer.data[id] && answer.data[id].startsWith('faculty_-_') ? answer.data[id].slice(10) : null

    if (faculty) {
      if (!faculties[faculty]) {
        faculties[faculty] = 0
      }
      faculties[faculty] += 1
    }
  }

  return (
    <div style={{ marginTop: 20, marginLeft: 20 }}>
      <h4>Answers peer faculty</h4>
      <Table celled>
        <Table.Body>
          {data.map(object => (
            <Table.Row key={object.code}>
              <Table.Cell>{object.name[lang]}</Table.Cell>
              <Table.Cell>{faculties[object.code] || 0}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default Question
