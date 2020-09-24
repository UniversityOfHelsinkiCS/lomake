import React, {useMemo} from 'react'
import { useSelector } from 'react-redux'
import { CSVLink } from 'react-csv'
import { translations } from 'Utilities/translations'
import { programmeNameByKey as programmeName } from 'Utilities/common'
import { keysWithFaculties } from 'Utilities/common'
import questions from '../../questions'


const CsvDownload =
  ({ wantedData, view, programme }) => {
  const languageCode = useSelector((state) => state.language)
  const answers = useSelector((state) => state.tempAnswers)
  const oldAnswers = useSelector((state) => state.oldAnswers)
  const year = useSelector((state) => state.form.selectedYear)
  const currentUser = useSelector((state) => state.currentUser)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const programmeData = useSelector(({ form }) => form.data)
  const facultiesData = useSelector(({ faculties }) => faculties.data)


  const usersProgrammes = useMemo(() => {
    const usersPermissionsKeys = Object.keys(currentUser.data.access)
    return currentUser.data.admin
      ? programmes
      : programmes.filter((program) => usersPermissionsKeys.includes(program.key))
  }, [programmes, currentUser.data])
  
  const handleData = (answers, oldAnswers, year, programmeData) => {

    // Create an array of arrays, with questions at index 0, and question_ids at index 1
    let csvData = questions.reduce(
      (acc, cur) => {
        const newArray = cur.parts.reduce(
          (acc, cur) => {
            if (cur.type === 'TITLE') return acc
            const questionText = cur.label
              ? cur.label[languageCode]
              : cur.title[languageCode]
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
    csvData[0].push(translations.faculty[languageCode])
    csvData[0].push(translations.programmeHeader[languageCode])
    csvData[1].push("//")
    csvData[1].push("//")
    csvData[0].reverse()
    csvData[1].reverse()

    const cleanText = (string) => {
      const cleanedText = string
      .replace(/,/g, '\,')
      .replace(/"/g, '\'')
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
    const getMeasuresAnswer = (data) => {
      const questionId = 'measures'
      if (!data) return ''
      if (!!data[`${questionId}_text`]) return data[`${id}_text`]
  
      if (!!data[`${questionId}_1_text`]) {
        let measures = ''
        let i = 1
        while (i < 6) {
          if (!!data[`${questionId}_${i}_text`])
            measures += `${i}) ${cleanText(data[`${questionId}_${i}_text`])} \n`
          i++
        }

        return measures
      }

      return null
    }

    const getWrittenAnswers = (rawData) => {

      const answersArray = csvData[1].slice(2).map((questionId) => {
        let validValues = []

        const questionText = rawData[`${questionId}_text`]
        if (questionText) {
          const cleanedText = cleanText(questionText)
            validValues = [...validValues, cleanedText]
          }
        if (questionId === 'measures') validValues = [...validValues, getMeasuresAnswer(rawData)]
        return validValues.join('\n')
      })

      return answersArray
    }

    const getSmileyAnswers = (rawData) => {
      const answerArray = csvData[1].slice(2).map((questionId) => {
        const smileyText = rawData[`${questionId}_light`]
        if (smileyText == 'green') return translations.green[languageCode]
        if (smileyText == 'yellow') return translations.yellow[languageCode]
        if (smileyText == 'red') return translations.red[languageCode]
        return ''
      })

      return answerArray
    }

    const faculties = keysWithFaculties(facultiesData)

    if (view == "form") {
      let answersArray = []
      if (wantedData === 'written') answersArray = getWrittenAnswers(programmeData)
      else if (wantedData === 'smileys') answersArray = getSmileyAnswers(programmeData)

      const name = programmeName(null, programme, languageCode)
      const faculty = faculties.get(programme.key)
      const dataRow = [name, faculty, ...answersArray]
      csvData = [...csvData, dataRow]

    } else if (view == "overview") {

      const selectedAnswers = year === new Date().getFullYear()
        ? answers.data
        : oldAnswers.data.filter((a) => a.year === year)

      if (!selectedAnswers) return [[],[]]

      selectedAnswers.forEach((programme) => {
        let answersArray = []
        if (wantedData === 'written') answersArray = getWrittenAnswers(programme.data)
        else if (wantedData === 'smileys') answersArray = getSmileyAnswers(programme.data)

        const name = programmeName(usersProgrammes, programme, languageCode)
        const faculty = faculties.get(programme.programme)
        const dataRow = [name, faculty, ...answersArray]
        csvData = [...csvData, dataRow]
      })  
    }

    return csvData
  }

  return (
    <CSVLink
      filename={`${year}_${translations.csvFile[view][wantedData][languageCode]}_.csv`} 
      data={handleData(answers, oldAnswers, year, programmeData)} 
      separator=","
    >        
      {translations.csvLink[wantedData][languageCode]}
    </CSVLink>
  )
}

export default CsvDownload