import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setViewOnly } from 'Utilities/redux/formReducer'
import { colors } from 'Utilities/common'
import { formViewTranslations as translations } from 'Utilities/translations'

const PDFDownload = () => {
  const lang = useSelector((state) => state.language)
  const dispatch = useDispatch()
  const deadline = useSelector((state) => state.deadlines.nextDeadline)
  const handleViewOnlyChange = (value) => dispatch(setViewOnly(value))
  const programme = useSelector((state) => state.studyProgrammes.singleProgram)
  const user = useSelector((state) => state.currentUser.data)
  const [takingPDF, setTakingPDF] = useState(false)

  const userHasWriteAccess =
    user.admin || (user.access[programme.key] && user.access[programme.key].write)
  const userCanEdit = (userHasWriteAccess && !programme.locked && deadline) ? true : false

  const openViewModeAndPrintPdf = () => {
    handleViewOnlyChange(true)
    setTakingPDF(true)
  }

  useEffect(() => {
    if (takingPDF) {
      //  ¯\_(ツ)_/¯ seems to work
      // inspiration taken from this answer https://stackoverflow.com/a/50473614
      // but it seems like adding the isSuccessful check to window.print() was a necessary addition
      // for Firefox support
      try {
        const isSuccessful = document.execCommand('print', false, null)
        if (isSuccessful === false) {
          window.print()
        }
      } catch (e) {
        window.print()
      }
      setTakingPDF(false)
      if (userCanEdit) handleViewOnlyChange(false)
    }
  }, [takingPDF])

  return (
    <span style={{ cursor: 'pointer', color: colors.blue }} onClick={openViewModeAndPrintPdf}>
      {translations.downloadText[lang]}
    </span>
  )
}

export default PDFDownload
