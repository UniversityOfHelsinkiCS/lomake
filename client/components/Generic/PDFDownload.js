import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { colors } from 'Utilities/common'
import { setQuestions } from 'Utilities/redux/filterReducer'
import './Generic.scss'

const PDFDownload = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const [takingPDF, setTakingPDF] = useState(false)
  const { questions, level, faculty, year } = useSelector(state => state.filters)

  const getExportText = () => {
    const formText = t('generic:pdfExportText')
    const facultyText = faculty === 'allFaculties' ? '' : faculties.find(f => f.code === faculty).name[lang]
    const levelText = t(level)
    return `${formText}_${year}_${facultyText}_${levelText}`
  }

  const openQuestionsAndPrintPdf = () => {
    dispatch(setQuestions({ selected: questions.selected, open: questions.selected }))
    setTakingPDF(true)
    document.title = getExportText()
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
      document.title = `${t('generic:reportPage')}`
    }
  }, [takingPDF])

  return (
    <span style={{ cursor: 'pointer', color: colors.blue, fontSize: '0.9em' }} onClick={openQuestionsAndPrintPdf}>
      {t('generic:downloadPDF')}
    </span>
  )
}

export default PDFDownload
