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

  if (!answers) return <Loader active />

  const getAnswer = (part, faculty) => {
    const value = `${part}_text`
    const answer = answers.find(a => a.programme === faculty)

    if (answer.data.selectedQuestionIds) {
      const questionIds = answer.data.selectedQuestionIds
      const selected = questionIds.includes(value)

      if (answer.data[`${value}_lights_history`]) {
        const lightList = answer.data[`${value}_lights_history`]
        const { color } = lightList[lightList.length - 1]
        return <Icon color={color} name="checkmark" size="large" />
      }
      if (selected) return <Icon color="grey" name="checkmark" size="large" />
    }

    return null
  }

  return (
    <>
      <Menu size="large" className="filter-row" secondary>
        <MenuItem header className="menu-item-header">
          <h2>{t('facultymonitoring').toUpperCase()}</h2>
        </MenuItem>
      </Menu>

      <Table>
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
                  <TableCell>{getAnswer(part.id, faculty.key)}</TableCell>
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
