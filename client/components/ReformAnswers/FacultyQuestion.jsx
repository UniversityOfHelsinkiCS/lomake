import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableRow } from '@mui/material'
import { useGetOrganisationDataQuery } from '../../redux/organisation'
import CircularProgress from '@mui/material/CircularProgress'

const Question = ({ question, answers }) => {
  const lang = useSelector(state => state.language)
  const { data, isFetching } = useGetOrganisationDataQuery()

  const { id } = question

  const faculties = {}

  for (const answer of answers) {
    const faculty = answer.data[id]?.startsWith('faculty_-_') ? answer.data[id].slice(10) : null

    if (faculty) {
      if (!faculties[faculty]) {
        faculties[faculty] = 0
      }
      faculties[faculty] += 1
    }
  }

  if (isFetching) return <CircularProgress />

  return (
    <div style={{ marginTop: 20, marginLeft: 20 }}>
      <h4>Answers peer faculty</h4>
      <Table celled>
        <TableBody>
          {data.map(object => (
            <TableRow key={object.code}>
              <TableCell>{object.name[lang]}</TableCell>
              <TableCell>{faculties[object.code] || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Question
