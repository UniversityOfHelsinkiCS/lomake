import React from 'react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import Textarea from 'Components/Generic/Textarea'
import Entity from 'Components/Generic/Entity'
import Measures from 'Components/Generic/Measures'
import { colors } from 'Utilities/common'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#E4E4E4',
    padding: 25
  },
  section: {
    //margin: 10,
    //padding: 10
  },
  sectionTitle: {
    color: colors.theme_blue
  },
  questionTitle: {
    fontWeight: 'bold',
    //margin: 10,
    paddingTop: 10
  },
  answer: {
    fontWeight: 'normal',
    fontSize: '10px'
    //margin: 10,
    //padding: 10
  }
})

const AnswersDocument = ({ questions, languageCode, formData }) => {
  /*const partComponentMap = {
    TEXTAREA: Textarea,
    ENTITY: Entity,
    MEASURES: Measures
  }
  let number = 0
  const partMap = (part) => {
    if (!partComponentMap.hasOwnProperty(part.type)) {
      console.error(`No component matching '${part.type}'`)
      return null
    }

    if (part.type === 'ENTITY') number++

    const Component = partComponentMap[part.type]
    const description = part.description ? part.description[languageCode] : undefined

    return (
      <Component
        key={part.id}
        id={part.id}
        label={part.label[languageCode]}
        description={description}
        required={part.required}
        noLight={part.no_light}
        number={number}
      />
    )
  }*/

  const partMap = (part) => {
    const { id, label } = part

    const localizedLabel = label[languageCode]
    const textValue = formData[`${id}_text`]
    const lightValue = formData[`${id}_light`]

    if (!textValue) return null

    return (
      <React.Fragment>
        <Text style={styles.questionTitle}>{localizedLabel}</Text>
        {lightValue && <Text>{lightValue}</Text>}
        {textValue && <Text style={styles.answer}>{textValue}</Text>}
      </React.Fragment>
    )
  }

  return (
    <Document>
      <Page style={styles.page}>
        {questions.map((section, index) => {
          return (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title[languageCode]}</Text>
              {section.parts.map(partMap)}
            </View>
          )
        })}
      </Page>
    </Document>
  )
}

const PDFDownload = ({ questions }) => {
  const languageCode = useSelector((state) => state.language)
  const formData = useSelector(({ form }) => form.data)

  console.error('PDFDownload is an unfinished component')

  return (
    <>
      <PDFDownloadLink
        document={
          <AnswersDocument questions={questions} languageCode={languageCode} formData={formData} />
        }
        fileName="hy_form_answers.pdf"
      >
        {({ blob, url, loading, error }) => (loading ? null : 'Download current answers as PDF')}
      </PDFDownloadLink>
    </>
  )
}

export default PDFDownload
