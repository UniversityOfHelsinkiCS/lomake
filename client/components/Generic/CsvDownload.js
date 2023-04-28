import React from 'react'
import { useSelector } from 'react-redux'
import { CSVLink } from 'react-csv'
import { useTranslation } from 'react-i18next'
import { answersByYear, programmeNameByKey as getProgrammeName } from 'Utilities/common'
import questions from '../../questions.json'
import './Generic.scss'

const handleData = ({ t, lang, programmeData, usersProgrammes, selectedAnswers, programme, wantedData, view }) => {
  // Create an array of arrays, with questions at index 0, and question_ids at index 1
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
        [[], []]
      )
      return [
        [...newArray[0], ...acc[0]],
        [...newArray[1], ...acc[1]],
      ]
    },
    [[], []]
  )
  csvData[0].push(t('faculty'))
  csvData[0].push(t('programmeHeader'))
  csvData[1].push('//')
  csvData[1].push('//')
  csvData[0].reverse()
  csvData[1].reverse()

  const cleanText = string => {
    const cleanedText = string
      .replace(/,/g, ',')
      .replace(/"/g, "'")
      .replace(/\n\n/g, '\n')
      .replace(/. +\n/g, '.\n')
      .replace(/ {4}- /g, '')
      .replace(/^- /g, '')
      .replace(/\n- /g, '\n')
      .replace(/ +- +/g, '\n')
      .replace(/\r/g, ' ')
      .replace(/;/g, ',')
      .replace(/\*\*/g, '')
      .replace(/&#8259;/g, ' ')
      .replace(/ *• */g, '')
      .replace(/· /g, '')
      .replace(/_x000D_/g, '\n')

    return cleanedText
  }

  // written answers for the "Measures"-question
  const getMeasuresAnswer = (data, id) => {
    const questionId = id
    if (!data) return ''
    if (data[`${questionId}_text`]) return data[`${id}_text`]

    if (data[`${questionId}_1_text`]) {
      let measures = ''
      let i = 1
      while (i < 6) {
        if (data[`${questionId}_${i}_text`]) measures += `${i}) ${cleanText(data[`${questionId}_${i}_text`])} \n`
        i++
      }

      return measures
    }

    return null
  }

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
    const name = programme.name[lang]
    const faculty = programme.primaryFaculty.name[lang]
    const dataRow = [name, faculty, ...answersArray]
    csvData = [...csvData, dataRow]
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

const CsvDownload = ({ wantedData, view, programme }) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const answers = useSelector(state => state.tempAnswers)
  const oldAnswers = useSelector(state => state.oldAnswers)
  const year = useSelector(({ filters }) => filters.year)
  const programmeData = useSelector(({ form }) => form.data)
  const draftYear = useSelector(state => state.deadlines.draftYear)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const selectedAnswers = answersByYear({ year, answers, oldAnswers, draftYear })

  const data = React.useMemo(
    () =>
      handleData({
        t,
        lang,
        answers,
        oldAnswers,
        year,
        programmeData,
        draftYear,
        usersProgrammes,
        selectedAnswers,
        wantedData,
        view,
        programme,
      }),
    [
      t,
      lang,
      answers,
      oldAnswers,
      year,
      programmeData,
      draftYear,
      usersProgrammes,
      selectedAnswers,
      wantedData,
      view,
      programme,
    ]
  )

  const dataTitle = t(`generic:csvFile${view}${wantedData}`)

  return (
    <CSVLink filename={`${year}_${dataTitle}_.csv`} data={data} separator=",">
      {t(`generic:${wantedData}`)}
    </CSVLink>
  )
}

export default CsvDownload
