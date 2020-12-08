import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { colors } from 'Utilities/common'
import { setQuestions } from 'Utilities/redux/filterReducer'
import { genericTranslations as translations } from 'Utilities/translations'

const PDFDownload = () => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)
  const [takingPDF, setTakingPDF] = useState(false)
  const questions = useSelector(({ filters }) => filters.questions)
  

  const openQuestionsAndPrintPdf = () => {
    dispatch(setQuestions({ selected: questions.selected, open: questions.selected }))
    setTakingPDF(true)
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
    }
  }, [takingPDF])

  return (
    <span style={{ cursor: 'pointer', color: colors.blue, fontSize: '0.9em' }} onClick={openQuestionsAndPrintPdf}>
      {translations.downloadText[lang]}
    </span>
  )
}

export default PDFDownload
