import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { colors } from 'Utilities/common'
import { setQuestions } from 'Utilities/redux/filterReducer'
import { genericTranslations as translations } from 'Utilities/translations'
import facultyNames from '../../facultyTranslations'


const PDFDownload = () => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)
  const [takingPDF, setTakingPDF] = useState(false)
  const { questions, level, faculty, year } = useSelector((state) => state.filters)
  

  const openQuestionsAndPrintPdf = () => {
    dispatch(setQuestions({ selected: questions.selected, open: questions.selected }))
    setTakingPDF(true)
    document.title = getExportText()
  }

  const getExportText = () => {
    const formText = translations.pdfExportText[lang]
    const facultyText = facultyNames[lang].find((f) => f.value === faculty).text
    const levelText = translations[level][lang]
    return `${formText}_${year}_${facultyText}_${levelText}`
  }

  useEffect(() => {    
    if (takingPDF) {
      try {
        const isSuccessful = document.execCommand('print', false, null)
        if (isSuccessful === false) {
          window.print()
        }
      } catch (e) {
        window.print()
      }

      setTakingPDF(false)
      dispatch(setQuestions({ selected: questions.selected, open: [] }))
      document.title = `${translations['reportPage'][lang]}`
    }
  }, [takingPDF])

  return (
    <span style={{ cursor: 'pointer', color: colors.blue, fontSize: '0.9em' }} onClick={openQuestionsAndPrintPdf}>
      {translations.downloadText[lang]} 
    </span>
  )
}

export default PDFDownload
