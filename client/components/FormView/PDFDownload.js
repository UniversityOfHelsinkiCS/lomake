import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setViewOnly } from 'Utilities/redux/formReducer'

const translations = {
  downloadText: {
    fi: 'Tulosta / Lataa vastaukset PDF-tiedostona',
    en: 'Print / Download answers as a PDF-file',
    se: 'Skriv ut / Ladda ner svaren i en PDF-fil',
  },
  setViewOnlyTrueText: {
    fi: 'Tulostus/PDF -näkymä',
    en: 'Print/Download as PDF view',
    se: 'Utskriftsläge/Pdf-vy',
  },
  setViewOnlyFalseText: {
    fi: 'Palaa täyttämään lomaketta',
    en: 'Back to edit view',
    se: 'Återgå till redigeringsläge',
  },
}

const PDFDownload = () => {
  const languageCode = useSelector((state) => state.language)
  const dispatch = useDispatch()
  const handleViewOnlyChange = (value) => dispatch(setViewOnly(value))
  const programme = useSelector((state) => state.studyProgrammes.singleProgram)
  const user = useSelector((state) => state.currentUser.data)
  const [takingPDF, setTakingPDF] = useState(false)

  const userHasWriteAccess =
    user.admin || (user.access[programme.key] && user.access[programme.key].write)
  const userCanEdit = userHasWriteAccess && !programme.locked ? true : false

  const openViewModeAndPrintPdf = () => {
    handleViewOnlyChange(true)
    setTakingPDF(true)
  }

  useEffect(() => {
    if (takingPDF) {
      try {
        document.execCommand('print', false, null)
      } catch (e) {
        window.print()
      }
      setTakingPDF(false)
      if (userCanEdit) handleViewOnlyChange(false)
    }
  }, [takingPDF])

  return (
    <span style={{ cursor: 'pointer', color: '#4183C4' }} onClick={openViewModeAndPrintPdf}>
      {translations.downloadText[languageCode]}
    </span>
  )
}

export default PDFDownload
