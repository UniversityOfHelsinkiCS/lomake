import React from 'react'
import { CSVLink } from 'react-csv'
import { useSelector } from 'react-redux'

const translations = {
  downloadText: {
    fi: 'Lataa vastaukset CSV tiedostona',
    en: 'Download answers as a CSV file',
    se: 'Ladda ner svaren i en csv-fil',
  },
}

const CSVDownload = ({ questions, programmeName, year }) => {
  const languageCode = useSelector((state) => state.language)
  const formData = useSelector(({ form }) => form.data)

  const formattedProgrammeName = programmeName.replace(/ /g, "_").replace(/'|,/g, "")

  // generating array of arrays where 0 index is question text and 1 index the question id
  const csvData = questions.reduce(
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

  csvData[0].reverse()
  csvData[1].reverse()

  const getMeasuresAnswer = () => {
    const questionId = 'measures'
    if (!formData) return ''
    if (!!formData[`${questionId}_text`]) return formData[`${id}_text`]

    if (!!formData[`${questionId}_1_text`]) {
      let measures = ''
      let i = 1
      while (i < 6) {
        if (!!formData[`${questionId}_${i}_text`])
          measures += `${i}) ${formData[`${questionId}_${i}_text`]}  `
        i++
      }

      return measures
    }

    return null
  }

  const answersArray = csvData[1].map((questionId) => {
    const questionText = formData[`${questionId}_text`]
    const validValues = []
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

        validValues.push(cleanedText)
      }
    if (questionId === 'measures') validValues.push(getMeasuresAnswer())

    return validValues.join('\n')
  })

  csvData.push(answersArray)

  return (
    <CSVLink filename={`${year}_Tilannekuvalomake_${formattedProgrammeName}.csv`} data={csvData} separator=";">
      {translations.downloadText[languageCode]}
    </CSVLink>
  )
}

export default CSVDownload
