import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CSVLink } from 'react-csv'
import { translations } from '../../util/translations'
import questions from '../../questions'


const CsvDownload = React.memo(
  ({ programmes, wantedData }) => {
  const languageCode = useSelector((state) => state.language)
  const answers = useSelector((state) => state.tempAnswers)
  const oldAnswers = useSelector((state) => state.oldAnswers)
  const year = useSelector((state) => state.form.selectedYear)
  const [linkText, setLinkText] = useState([])

  useEffect(() => {
    if (wantedData === 'written') setLinkText(translations.writtenAnswers[languageCode])
    if (wantedData === 'smileys') setLinkText(translations.smileys[languageCode])
  }, [])
  
  const handleData = (answers, oldAnswers, year, programmes) => {

    const selectedAnswers = year === new Date().getFullYear()
      ? answers.data
      : oldAnswers.data.filter((a) => a.year === year)
   
    if (!selectedAnswers) return [[],[]]
    
    let csvData = questions.reduce(
      (acc, cur) => {
        const newArray = cur.parts.reduce(
          (acc, cur) => {
            if (cur.type === 'TITLE') return acc
            const questionText = cur.description
              ? cur.description[languageCode]
              : cur.label[languageCode]
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
    csvData[0].push(translations.questions[languageCode])
    csvData[1].push(translations.questionIds[languageCode])
    csvData[0].reverse()
    csvData[1].reverse()

    const getMeasuresAnswer = (data) => {
      const questionId = 'measures'
      if (!data) return ''
      if (!!data[`${questionId}_text`]) return selectedAnswers[`${id}_text`]
  
      if (!!data[`${questionId}_1_text`]) {
        let measures = ''
        let i = 1
        while (i < 6) {
          if (!!data[`${questionId}_${i}_text`])
            measures += `${i}) ${data[`${questionId}_${i}_text`]}  `
          i++
        }
        return measures
      }

      return null
    }

    const getWrittenAnswers = (rawData) => {

      const answersArray = csvData[1].map((questionId) => {
        let validValues = []

        const questionText = rawData[`${questionId}_text`]
        if (questionText) {
          const cleanedText = questionText
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
            .replace(/_x000D_/g, '\n')
    
            validValues = [...validValues, cleanedText]
          }
        if (questionId === 'measures') validValues = [...validValues, getMeasuresAnswer(rawData)]  
        return validValues.join('\n')
      })
      answersArray.shift()
      return answersArray
    }

    const getSmileyAnswers = (rawData) => {
      const answerArray = csvData[1].map((questionId) => {
        const smileyText = rawData[`${questionId}_light`]
        if (smileyText == 'green') return translations.green[languageCode]
        if (smileyText == 'yellow') return translations.yellow[languageCode]
        if (smileyText == 'red') return translations.red[languageCode]
        return ''
      })
      answerArray.shift()
      return answerArray
    }

    selectedAnswers.forEach((programme) => {
      let cleanedData = []
      let answersArray = []
      const rawData = programme.data
      const prog = programmes.find((a) => a.key === programme.programme)
      if (prog) cleanedData = [...cleanedData, prog.name[languageCode] ? prog.name[languageCode] : prog.name['en']]
      
      if (wantedData === 'written') answersArray = getWrittenAnswers(rawData)
      else if (wantedData === 'smileys') answersArray = getSmileyAnswers(rawData)
      
      cleanedData = [...cleanedData, ...answersArray]
      csvData = [...csvData, cleanedData]
    })

    return csvData
  }

  return (
    <CSVLink
      filename={`${year}_${translations.allData[wantedData][languageCode]}_.csv`} 
      data={handleData(answers, oldAnswers, year, programmes)} 
      separator=";"
    >        
      {linkText}
    </CSVLink>
  )
})

export default CsvDownload