/* eslint-disable react-hooks/exhaustive-deps */
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
  Icon,
  Radio,
  Button,
} from 'semantic-ui-react'
import { PieChart } from 'react-minimal-pie-chart'
import { Link } from 'react-router'
import './FacultyMonitoringOverview.scss'
import { useDispatch, useSelector } from 'react-redux'
import CustomModal from '../../Generic/CustomModal'
import { formKeys } from '../../../../config/data'
import { getTempAnswersByForm } from '../../../redux/tempAnswersReducer'
import { facultyMonitoringQuestions as questions } from '../../../../client/questionData/index'
import Square from '../../Generic/Square'
import ModalAnswer from './ModalAnswer'
import FacultyDegreeDropdown from '../FacultyDegreeDropdown'
import DegreeLevelDropdown from '../DegreeLevelDropdown'

const MonitoringOverview = ({ t, lang, faculties }) => {
  const dispatch = useDispatch()
  const answers = useSelector(state => state.tempAnswers.data)
  const [questionModal, setQuestionModal] = useState(null)
  const [accordion, setAccordion] = useState(false)
  const selectedLevel = useSelector(({ filters }) => filters.level)
  const [showAll, setShowAll] = useState(false)

  const questionLevel = selectedLevel === 'doctoral' ? 'doctoral' : 'kandimaisteri'
  const questionData = questions.filter(q => q.level === questionLevel)
  const [radioFilter, setRadioFilter] = useState('all')

  const filteredFaculties = useMemo(
    () =>
      (faculties ?? [])
        .filter(f => f.code !== 'HTEST')
        .map(f => ({
          key: f.code,
          text: f.name[lang],
        })),
    [faculties, lang]
  )

  useEffect(() => {
    setRadioFilter('all')
    dispatch(getTempAnswersByForm(formKeys.FACULTY_MONITORING))
  }, [selectedLevel])

  if (!answers || !faculties) return <Loader active />

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
      const degree = answer.data[`${part.id}_degree_radio`]

      if (radioFilter !== 'all' && degree !== radioFilter) return null

      if (lightList && lightList.length > 1) {
        const lastMeasurement = lightList[lightList.length - 1]
        const secondLastMeasurement = lightList[lightList.length - 2]

        const hasChangedToPositive = lastMeasurement.value > secondLastMeasurement.value
        const hasChangedToNegative = lastMeasurement.value < secondLastMeasurement.value

        let chevron = null

        if (hasChangedToPositive) chevron = <Icon color="black" name="chevron up" size="large" />
        if (hasChangedToNegative) chevron = <Icon color="black" name="chevron down" size="large" />

        const { color } = lastMeasurement
        return (
          <Square
            answerObject={answerObject}
            chevron={chevron}
            color={color}
            setQuestionModal={setQuestionModal}
            t={t}
          />
        )
      }

      if (lightList && lightList.length > 0) {
        const { color } = lightList[lightList.length - 1]
        return <Square answerObject={answerObject} color={color} setQuestionModal={setQuestionModal} t={t} />
      }

      if (selected) {
        return <Square answerObject={answerObject} color="gray" setQuestionModal={setQuestionModal} t={t} />
      }
    }

    return null
  }

  const getFacultySummarySectionData = (section, faculty) => {
    const answer = answers.find(a => a.programme === faculty)

    if (answer?.data.selectedQuestionIds) {
      const questionIds = section.parts.map(part => part.id)

      const summaryAnswers = questionIds.map(id => {
        const key = `${id}_lights_history`
        const radio = `${id}_degree_radio`
        if (radioFilter !== 'all' && answer.data?.[radio] !== radioFilter) return []
        return answer.data[key] ?? []
      })

      const colors = {
        green: { value: 0, programmes: [] },
        yellow: { value: 0, programmes: [] },
        red: { value: 0, programmes: [] },
        emptyAnswer: { value: 0, programmes: [] },
        withoutEmpty: { value: 0, programmes: [] },
        total: { value: 0 },
      }

      const selectedQuestionIds = answer.data.selectedQuestionIds ?? []

      summaryAnswers.forEach((answerList, index) => {
        const questionId = questionIds[index]

        if (!selectedQuestionIds.includes(questionId)) {
          return null
        }
        if (answerList.length === 0 && selectedQuestionIds.includes(questionId)) {
          colors.emptyAnswer.value += 1
        } else if (answerList.length > 0) {
          const lastEntry = answerList[answerList.length - 1]
          if (lastEntry?.color) {
            colors[lastEntry.color].value += 1
            colors[lastEntry.color].programmes.push(lastEntry.date)
          }
        }

        return null
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
            labelPosition={112}
            labelStyle={{ fontSize: '4px', fontWeight: 'bold' }}
            lengthAngle={360}
            lineWidth={100}
            paddingAngle={0}
            radius={50}
            startAngle={270}
            viewBoxSize={[100, 100]}
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

  if (!answers) return <Loader active />

  return (
    <div className="monitoring-overview">
      <Menu className="filter-row" secondary size="large">
        <MenuItem className="menu-item-header" header>
          <h2>{t('facultymonitoring').toUpperCase()}</h2>
        </MenuItem>
        <MenuItem>
          <Button as={Link} data-cy="nav-report" secondary size="big" to="/report?form=8">
            {t('overview:readAnswers')}
          </Button>
        </MenuItem>
        <MenuItem>
          <FacultyDegreeDropdown />
        </MenuItem>
        {selectedLevel !== 'doctoral' && (
          <MenuItem>
            <DegreeLevelDropdown radioFilter={radioFilter} setRadioFilter={setRadioFilter} t={t} />
          </MenuItem>
        )}
      </Menu>

      {questionModal ? (
        <CustomModal
          closeModal={closeModal}
          title={`${faculties?.find(f => f.code === questionModal.faculty)?.name[lang]}  ${questionModal.faculty}`}
        >
          <ModalAnswer
            answer={questionModal.answer.data}
            faculty={questionModal.faculty}
            modify={false}
            question={questionModal.part}
          />
        </CustomModal>
      ) : null}

      <Table className="table monitoring-table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell className="table-header-cell">
              <Radio
                data-cy="overviewpage-filter-button"
                label={t('showAll')}
                onChange={() => setShowAll(!showAll)}
                style={{ marginRight: 'auto' }}
                toggle
              />
            </TableHeaderCell>
            {filteredFaculties
              .sort((a, b) => a.text.localeCompare(b.text))
              .map(faculty => (
                <TableHeaderCell className="table-header-cell" key={faculty.key}>
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
                  <Header as="h5" className="accordion-header" onClick={() => handleAccordion(index)}>
                    {section.title[lang]}
                  </Header>
                </TableCell>
                {filteredFaculties.map(faculty => (
                  <TableCell className="pie-chart-cell" key={faculty.key}>
                    {getFacultySummarySectionData(section, faculty.key)}
                  </TableCell>
                ))}
              </TableRow>
              {showAll
                ? section.parts.map(part => (
                    <TableRow key={part.id}>
                      <TableCell className="table-header-cell">
                        <div className="question-text">
                          {part.index}. {part.label[lang]}
                        </div>
                      </TableCell>
                      {filteredFaculties.map(faculty => (
                        <TableCell className="square-cell" key={faculty.key}>
                          {getAnswer(part, faculty.key)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : null}
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
                      <TableCell className="square-cell" key={faculty.key}>
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
