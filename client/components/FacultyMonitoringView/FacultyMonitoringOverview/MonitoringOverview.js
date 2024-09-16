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
import { PieChart } from 'react-minimal-pie-chart'
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

  const getFacultySummarySectionData = (section, faculty) => {
    const answer = answers.find(a => a.programme === faculty)

    if (answer && answer.data.selectedQuestionIds) {
      const questionIds = section.parts.map(part => part.id)
      const summaryAnswers = questionIds.map(id => {
        const key = `${id}_lights_history`
        return answer.data[key] || []
      })

      const colors = {
        green: { value: 0, programmes: [] },
        yellow: { value: 0, programmes: [] },
        red: { value: 0, programmes: [] },
        emptyAnswer: { value: 0, programmes: [] },
        withoutEmpty: { value: 0, programmes: [] },
        total: { value: 0 },
      }

      summaryAnswers.forEach(answerList => {
        if (answerList.length > 0) {
          const lastEntry = answerList[answerList.length - 1]
          if (lastEntry.color) {
            colors[lastEntry.color].value += 1
            colors[lastEntry.color].programmes.push(lastEntry.date)
          }
        }
      })

      colors.withoutEmpty.value = colors.red.value + colors.green.value + colors.yellow.value
      colors.total.value = colors.withoutEmpty.value + colors.emptyAnswer.value

      const data = [
        {
          title: 'Green',
          value: colors.green.value || 0,
          color: 'green',
        },
        {
          title: 'Yellow',
          value: colors.yellow.value || 0,
          color: 'yellow',
        },
        {
          title: 'Red',
          value: colors.red.value || 0,
          color: 'red',
        },
        {
          title: 'Empty',
          value: colors.emptyAnswer.value || 0,
          color: 'grey',
        },
      ]

      return (
        <PieChart
          data={data.sort((a, b) => b.value - a.value)}
          lengthAngle={360}
          lineWidth={100}
          paddingAngle={0}
          radius={50}
          startAngle={270}
          viewBoxSize={[145, 145]}
          labelStyle={{ fontSize: '5px', fontWeight: 'bold' }}
          labelPosition={112}
        />
      )
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
          {facultyMonitoringQuestions.map((section, index) => (
            <TableRow>
              <TableCell>
                <h4>{section.title[lang]}</h4>
              </TableCell>
              {filteredFaculties.map(faculty => (
                <TableCell>{getFacultySummarySectionData(section, faculty.key)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default MonitoringOverview

/* 
 *
 *section.parts.map(part => (
              <TableRow>
                <TableCell>{part.label[lang]}</TableCell>
                {filteredFaculties.map(faculty => (
                  <TableCell>{getAnswer(part, faculty.key)}</TableCell>
                ))}
              </TableRow>
            )),

*/
