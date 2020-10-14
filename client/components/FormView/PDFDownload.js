import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setViewOnly } from 'Utilities/redux/formReducer'
import { colors } from 'Utilities/common'
import { formViewTranslations as translations } from 'Utilities/translations'


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
    <span style={{ cursor: 'pointer', color: colors.blue }} onClick={openViewModeAndPrintPdf}>
      {translations.downloadText[languageCode]}
    </span>
  )
}

export default PDFDownload
