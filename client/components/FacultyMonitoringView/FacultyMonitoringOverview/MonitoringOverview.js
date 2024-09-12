import React, { useMemo, useEffect, useState } from 'react'
import {
  Menu,
  MenuItem,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Button,
  Loader,
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './FacultyMonitoringOverview.scss'
import { useDispatch, useSelector } from 'react-redux'
import CustomModal from 'Components/Generic/CustomModal'
import { getTempAnswersByForm } from 'Utilities/redux/tempAnswersReducer'
import { formKeys } from '@root/config/data'
import { facultyMonitoringQuestions } from '@root/client/questionData/index'
import Answer from '../FacultyTrackingView/Answer'

const MonitoringOverview = ({ t, lang, faculties }) => {
  const dispatch = useDispatch()
  const answers = useSelector(state => state.tempAnswers.data)
  const form = formKeys.FACULTY_MONITORING
  const [questionModal, setQuestionModal] = useState(null)

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
    const answer = answers.find(a => a.programme === faculty)

    if (answer.data.selectedQuestionIds) {
      const questionIds = answer.data.selectedQuestionIds
      const selected = questionIds.includes(part.id)

      const answerObject = {
        answer,
        faculty,
        part,
      }

      const lightList = answer.data[`${part.id}_lights_history`]

      if (lightList && lightList.length > 0) {
        const { color } = lightList[lightList.length - 1]
        return <Button color={color} onClick={() => setQuestionModal(answerObject)} icon="checkmark" />
      }
      if (selected) {
        return <Button onClick={() => setQuestionModal(answerObject)} icon="checkmark" />
      }
    }

    return null
  }
  const closeModal = () => {
    setQuestionModal(null)
  }

  return (
    <>
      <Menu size="large" className="filter-row" secondary>
        <MenuItem header className="menu-item-header">
          <h2>{t('facultymonitoring').toUpperCase()}</h2>
        </MenuItem>
      </Menu>

      {questionModal && (
        <CustomModal closeModal={closeModal}>
          <Answer
            answer={questionModal.answer.data}
            question={questionModal.part}
            faculty={questionModal.faculty}
            modify={false}
          />
        </CustomModal>
      )}

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
                  <TableCell>{getAnswer(part, faculty.key)}</TableCell>
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
