import React from 'react'
import { CSVLink } from 'react-csv'
import { useSelector } from 'react-redux'

const translations = {
  downloadText: {
    fi: 'Lataa vastaukset CSV tiedostona',
    en: 'Download answers as CSV file',
    se: '',
  },
}

const CSVDownload = ({ questions }) => {
  const languageCode = useSelector((state) => state.language)
  const formData = useSelector(({ form }) => form.data)

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
    const lightText = formData[`${questionId}_light`]

    const validValues = []
    if (lightText) validValues.push(lightText)
    if (questionText) validValues.push(questionText.replace('\n', ' ').replace(';', ''))

    if (questionId === 'measures') validValues.push(getMeasuresAnswer())

    return validValues.join(' // ')
  })

  csvData.push(answersArray)

  let csvDataFormatted = []

  csvDataFormatted[0] = csvData[0].join(';')
  csvDataFormatted[1] = csvData[1].join(';')
  csvDataFormatted[2] = csvData[2].join(';')

  csvDataFormatted = csvDataFormatted.join('\n')

  return (
    <CSVLink filename="hy_ospa_lomake_answers.csv" data={csvDataFormatted + '\n'} separator=";">
      {translations.downloadText[languageCode]}
    </CSVLink>
  )
}

export default CSVDownload
