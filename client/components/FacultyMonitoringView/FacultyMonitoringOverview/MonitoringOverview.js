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
  Header,
  Loader,
  Card,
  Icon,
  Radio,
} from 'semantic-ui-react'
import { PieChart } from 'react-minimal-pie-chart'
import { Link } from 'react-router-dom'
import './FacultyMonitoringOverview.scss'
import { useDispatch, useSelector } from 'react-redux'
import CustomModal from 'Components/Generic/CustomModal'
import { getTempAnswersByForm } from 'Utilities/redux/tempAnswersReducer'
import { formKeys } from '@root/config/data'
import { facultyMonitoringQuestions as questions } from '@root/client/questionData/index'
import ModalAnswer from './ModalAnswer'
import FacultyDegreeDropdown from '../FacultyDegreeDropdown'

const squareStyles = {
  boxShadow: '0px 0px 1px 1px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  width: '80px',
  height: '80px',
  transition: 'filter 0.3s',
}

const colors = {
  red: { backgroundColor: '#ff7f7f', hover: { filter: 'brightness(0.8)' } },
  yellow: { backgroundColor: '#feffb0', hover: { filter: 'brightness(0.8)' } },
  green: { backgroundColor: '#9dfe9c', hover: { filter: 'brightness(0.8)' } },
  gray: { border: '4px solid gray', backgroundColor: 'transparent', hover: { filter: 'brightness(0.8)' } },
}

const Square = ({ color, setQuestionModal, answerObject, chevron = null }) => {
  const { backgroundColor, hover } = colors[color] || colors.gray

  return (
    <div className="square-container" data-cy={`square-${answerObject.faculty}-${answerObject.part.id}`}>
      <Card
        style={{
          ...squareStyles,
          backgroundColor,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.filter = hover.filter
        }}
        onMouseLeave={e => {
          e.currentTarget.style.filter = 'none'
        }}
        onClick={() => setQuestionModal(answerObject)}
      >
        {chevron}
      </Card>
    </div>
  )
}

const MonitoringOverview = ({ t, lang, faculties }) => {
  const dispatch = useDispatch()
  const answers = useSelector(state => state.tempAnswers.data)
  const form = formKeys.FACULTY_MONITORING
  const [questionModal, setQuestionModal] = useState(null)
  const [accordion, setAccordion] = useState(false)
  const selectedLevel = useSelector(({ filters }) => filters.level)
  const [showAll, setShowAll] = useState(false)

  const questionLevel = selectedLevel === 'doctoral' ? 'doctoral' : 'kandimaisteri'
  const questionData = questions.filter(q => q.level === questionLevel)

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

      if (!selected) return null

      const answerObject = {
        answer,
        faculty,
        part,
      }

      const lightList = answer.data[`${part.id}_lights_history`]

      if (lightList && lightList.length > 1) {
        const lastMeasurement = lightList[lightList.length - 1]
        const secondLastMeasurement = lightList[lightList.length - 2]

        const hasChangedToPositive = lastMeasurement.value > secondLastMeasurement.value
        const hasChangedToNegative = lastMeasurement.value < secondLastMeasurement.value

        let chevron = null

        if (hasChangedToPositive) chevron = <Icon name="chevron up" size="large" color="black" />
        if (hasChangedToNegative) chevron = <Icon name="chevron down" size="large" color="black" />

        const { color } = lastMeasurement
        return (
          <Square color={color} setQuestionModal={setQuestionModal} answerObject={answerObject} chevron={chevron} />
        )
      }

      if (lightList && lightList.length > 0) {
        const { color } = lightList[lightList.length - 1]
        return <Square color={color} setQuestionModal={setQuestionModal} answerObject={answerObject} />
      }

      if (selected) {
        return <Square color="grey" setQuestionModal={setQuestionModal} answerObject={answerObject} />
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

      const selectedQuestionIds = answer.data.selectedQuestionIds || []

      summaryAnswers.forEach((answerList, index) => {
        const questionId = questionIds[index]

        if (!selectedQuestionIds.includes(questionId)) {
          return null
        }
        if (answerList.length === 0 && selectedQuestionIds.includes(questionId)) {
          colors.emptyAnswer.value += 1
        } else if (answerList.length > 0) {
          const lastEntry = answerList[answerList.length - 1]
          if (lastEntry && lastEntry.color) {
            colors[lastEntry.color].value += 1
            colors[lastEntry.color].programmes.push(lastEntry.date)
          }
        }
      })

      const data = [
        {
          title: t('green'),
          value: colors.green.value || 0,
          color: '#9dfe9c',
        },
        {
          title: t('yellow'),
          value: colors.yellow.value || 0,
          color: '#feffb0',
        },
        {
          title: t('red'),
          value: colors.red.value || 0,
          color: '#ff7f7f',
        },
        {
          title: t('empty'),
          value: colors.emptyAnswer.value || 0,
          color: '#fafbfb',
        },
      ]

      return (
        <div className="pie-chart-container">
          <PieChart
            data={data.sort((a, b) => b.value - a.value)}
            lengthAngle={360}
            lineWidth={100}
            paddingAngle={0}
            radius={50}
            startAngle={270}
            viewBoxSize={[100, 100]}
            labelStyle={{ fontSize: '4px', fontWeight: 'bold' }}
            labelPosition={112}
          />
        </div>
      )
    }

    return null
  }

  const closeModal = () => {
    setQuestionModal(null)
  }

  const handleAccordion = sectionIndex => {
    if (accordion === sectionIndex) setAccordion(null)
    else setAccordion(sectionIndex)
  }

  return (
    <div className="monitoring-overview">
      <Menu size="large" className="filter-row" secondary>
        <MenuItem header className="menu-item-header">
          <h2>{t('facultymonitoring').toUpperCase()}</h2>
        </MenuItem>
        <MenuItem>
          <FacultyDegreeDropdown />
        </MenuItem>
      </Menu>

      {questionModal && (
        <CustomModal
          title={`${faculties?.find(f => f.code === questionModal.faculty)?.name[lang]}  ${questionModal.faculty}`}
          closeModal={closeModal}
        >
          <ModalAnswer
            answer={questionModal.answer.data}
            question={questionModal.part}
            faculty={questionModal.faculty}
            modify={false}
          />
        </CustomModal>
      )}

      <Table className="table monitoring-table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell className="table-header-cell">
              <Radio
                style={{ marginRight: 'auto' }}
                data-cy="overviewpage-filter-button"
                toggle
                onChange={() => setShowAll(!showAll)}
                label={t('showAll')}
              />
            </TableHeaderCell>
            {filteredFaculties
              .sort((a, b) => a.text.localeCompare(b.text))
              .map(faculty => (
                <TableHeaderCell key={faculty.key} className="table-header-cell">
                  <Link className="faculty-header" to={`/faculty-monitoring/${faculty.key}`}>
                    {faculty.text} {faculty.key}
                  </Link>
                </TableHeaderCell>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {questionData.map((section, index) => (
            <React.Fragment key={section.id}>
              <TableRow>
                <TableCell className="table-header-cell">
                  <Header className="accordion-header" as="h4" onClick={() => handleAccordion(index)}>
                    {section.title[lang]}
                  </Header>
                </TableCell>
                {filteredFaculties.map(faculty => (
                  <TableCell key={faculty.key} className="pie-chart-cell">
                    {getFacultySummarySectionData(section, faculty.key)}
                  </TableCell>
                ))}
              </TableRow>
              {showAll &&
                section.parts.map(part => (
                  <TableRow key={part.id}>
                    <TableCell className="table-header-cell">
                      <div className="question-text">
                        {part.index}. {part.label[lang]}
                      </div>
                    </TableCell>
                    {filteredFaculties.map(faculty => (
                      <TableCell key={faculty.key} className="square-cell">
                        {getAnswer(part, faculty.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              {accordion === index &&
                !showAll &&
                section.parts.map(part => (
                  <TableRow key={part.id}>
                    <TableCell className="table-header-cell">
                      <div className="question-text">
                        {part.index}. {part.label[lang]}
                      </div>
                    </TableCell>
                    {filteredFaculties.map(faculty => (
                      <TableCell key={faculty.key} className="square-cell">
                        {getAnswer(part, faculty.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default MonitoringOverview
