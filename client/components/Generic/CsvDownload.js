import React from 'react'
import { useSelector } from 'react-redux'
import { CSVLink } from 'react-csv'
import { formKeys } from '@root/config/data'

import { useTranslation } from 'react-i18next'
import {
  programmeNameByKey as getProgrammeName,
  getActionsAnswer,
  getMeasuresAnswer,
  cleanText,
} from 'Utilities/common'
import { yearlyQuestions, facultyEvaluationQuestions, evaluationQuestions } from '../../questionData'
import './Generic.scss'

const handleData = ({
  t,
  lang,
  programmeData,
  usersProgrammes,
  selectedAnswers,
  programme,
  wantedData,
  view,
  form,
}) => {
  // Create an array of arrays, with questions at index 0, and question_ids at index 1
  let questions = []
  if (form === formKeys.YEARLY_ASSESSMENT) {
    questions = yearlyQuestions
  } else if (form === formKeys.EVALUATION_FACULTIES) {
    questions = facultyEvaluationQuestions
  } else if (form === formKeys.EVALUATION_PROGRAMMES) {
    questions = evaluationQuestions
  }
  let csvData = questions.reduce(
    (acc, cur) => {
      const newArray = cur.parts.reduce(
        (acc, cur) => {
          if (cur.type === 'TITLE') return acc
          const questionText = cur.label ? cur.label[lang] : cur.title[lang]
          const questionId = cur.id
          return [
            [questionText, ...acc[0]],
            [questionId, ...acc[1]],
          ]
        },
        [[], []],
      )
      return [
        [...newArray[0], ...acc[0]],
        [...newArray[1], ...acc[1]],
      ]
    },
    [[], []],
  )
  csvData[0].push(t('faculty'))
  csvData[0].push(t('programmeHeader'))
  csvData[1].push('//')
  csvData[1].push('//')
  csvData[0].reverse()
  csvData[1].reverse()

  const getWrittenAnswers = rawData => {
    if (!Object.keys(rawData).length) return [] // May be empty initially

    const answersArray = csvData[1].slice(2).map(questionId => {
      let validValues = []

      // for order-type questions
      const questionOrderSelection = questionId.endsWith('_order')
      const questionText = rawData[questionOrderSelection ? questionId : `${questionId}_text`]
      // for selection-type questions
      const questionSelection = rawData[`${questionId}_selection`]

      if (questionText) {
        const cleanedText = cleanText(questionText)
        validValues = [cleanedText]
      }

      if (questionSelection) {
        const parsed = JSON.parse(questionSelection)
        // json format: { key1: true|false, key2: true|false, ... }
        // Make the cell value into a comma separated list
        validValues = [
          Object.keys(parsed)
            .filter(key => parsed[key])
            .join(', '),
        ]
      }
      if (questionOrderSelection && questionText) {
        // ordered values in a string separated by ;;
        validValues = [questionText.split(';;').join(', ')]
      }
      if (questionId.includes('actions')) {
        validValues = [...validValues, getActionsAnswer(rawData, questionId, t)]
        return validValues.join('\n')
      }

      if (questionId.startsWith('measures')) validValues = [...validValues, getMeasuresAnswer(rawData, questionId)]
      return validValues.join('\n')
    })

    return answersArray
  }

  const getColorAnswers = rawData => {
    const answerArray = csvData[1].slice(2).map(questionId => {
      const color = rawData[`${questionId}_light`]
      if (color) return t(color)
      return ''
    })

    return answerArray
  }

  const getProgrammeFaculty = programme => {
    const searched = usersProgrammes.find(p => p.key === programme.programme)
    if (!searched) return ''
    return searched.primaryFaculty.name[lang]
  }

  if (view === 'form') {
    let answersArray = []
    if (wantedData === 'written') answersArray = getWrittenAnswers(programmeData)
    else if (wantedData === 'colors') answersArray = getColorAnswers(programmeData)
    if (form === formKeys.EVALUATION_FACULTIES || form === formKeys.EVALUATION_COMMTTEES) {
      const name = programme.name[lang]
      const faculty = programme.name[lang]
      const dataRow = [name, faculty, ...answersArray]
      csvData = [...csvData, dataRow]
    } else {
      const name = programme.name[lang]
      const faculty = programme.primaryFaculty.name[lang]
      const dataRow = [name, faculty, ...answersArray]
      csvData = [...csvData, dataRow]
    }
  } else if (view === 'overview') {
    if (!selectedAnswers) return [[], []]
    if (!usersProgrammes) return [[], []]

    selectedAnswers.forEach(programme => {
      let answersArray = []
      if (wantedData === 'written') answersArray = getWrittenAnswers(programme.data)
      else if (wantedData === 'colors') answersArray = getColorAnswers(programme.data)
      const name = getProgrammeName(usersProgrammes, programme, lang)
      const faculty = getProgrammeFaculty(programme)
      const dataRow = [name, faculty, ...answersArray]
      csvData = [...csvData, dataRow]
    })
  }

  return csvData
}

const CsvDownload = ({ wantedData, view, programme, form = 1 }) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const year = useSelector(({ filters }) => filters.year)
  const programmeData = useSelector(({ form }) => form.data)
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const allTempAnswers = useSelector(state => state.tempAnswers)
  const allOldAnswers = useSelector(state => state.oldAnswers)

  // filter data for only correct form
  const formDeadline = nextDeadline ? nextDeadline.filter(dl => dl.form === form) : null
  const tempAnswers = allTempAnswers?.data ? allTempAnswers?.data.filter(answer => answer.form === form) : []
  const oldAnswers = allOldAnswers?.data ? allOldAnswers?.data.filter(answer => answer.form === form) : []

  const getAnswers = () => {
    if (formDeadline && year === draftYear.year && tempAnswers.length > 0) {
      return tempAnswers.filter(answer => answer.year === year)
    }

    if ((!draftYear || year !== draftYear.year) && oldAnswers && oldAnswers?.length > 0) {
      return oldAnswers.filter(answer => answer.year === year)
    }
    return []
  }

  const selectedAnswers = getAnswers()

  const data = React.useMemo(
    () =>
      handleData({
        t,
        lang,
        answers: tempAnswers,
        oldAnswers,
        year,
        programmeData,
        draftYear,
        usersProgrammes,
        selectedAnswers,
        wantedData,
        view,
        programme,
        form,
      }),
    [
      t,
      lang,
      tempAnswers,
      oldAnswers,
      year,
      programmeData,
      draftYear,
      usersProgrammes,
      selectedAnswers,
      wantedData,
      view,
      programme,
    ],
  )

  const dataTitle = t(`generic:csvFile${view}${wantedData}`)

  return (
    <CSVLink filename={`${year}_${dataTitle}_.csv`} data={data} separator=",">
      {t(`generic:${wantedData}`)}
    </CSVLink>
  )
}

export default CsvDownload
