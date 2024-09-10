import React, { useMemo, useEffect } from 'react'
import {
  Menu,
  MenuItem,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Icon,
  Loader,
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './FacultyMonitoringOverview.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getTempAnswersByForm } from 'Utilities/redux/tempAnswersReducer'
import { formKeys } from '@root/config/data'
import { facultyMonitoringQuestions } from '@root/client/questionData/index'
import * as answer from '@models/answer'

const MonitoringOverview = ({ t, lang, faculties }) => {
  const dispatch = useDispatch()
  const answers = useSelector(state => state.tempAnswers.data)
  const form = formKeys.FACULTY_MONITORING

  const filteredFaculties = useMemo(
    () =>
      faculties
        .filter(f => f.code !== 'HTEST')
        .map(f => ({
          key: f.code,
          text: f.name[lang],
        })),
    [faculties, lang],
  )

  useEffect(() => {
    dispatch(getTempAnswersByForm(form))
  }, [])

  console.log(answers)

  const getAnswer = ({ part, faculty }) => {
    return <Icon color="green" name="checkmark" size="large" />
  }

  if (!answers) return <Loader active />

  return (
    <>
      <Menu size="large" className="filter-row" secondary>
        <MenuItem header className="menu-item-header">
          <h2>{t('facultymonitoring').toUpperCase()}</h2>
        </MenuItem>
      </Menu>

      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell />
            {filteredFaculties.map(faculty => (
              <TableHeaderCell>
                <Link key={faculty.key} to={`/faculty-monitoring/${faculty.key}`}>
                  {faculty.text} {faculty.key}
                </Link>
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {facultyMonitoringQuestions.map(section =>
            section.parts.map(part => (
              <TableRow>
                <TableCell>{part.label[lang]}</TableCell>
                {filteredFaculties.map(faculty => (
                  <TableCell>{getAnswer(part, faculty)}</TableCell>
                ))}
              </TableRow>
            )),
          )}
        </TableBody>
      </Table>
    </>
  )
}

export default MonitoringOverview
