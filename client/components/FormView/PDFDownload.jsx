import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import ReactToPrint from 'react-to-print'
import { setViewOnly } from 'Utilities/redux/formReducer'
import { colors, isFormLocked } from 'Utilities/common'
import { isAdmin } from '@root/config/common'

const formShouldBeViewOnly = ({ draftYear, year, formDeadline, form, viewingOldAnswers, userHasWriteAccess }) => {
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  if (formDeadline?.form !== form) return true
  if (viewingOldAnswers) return true
  if (!userHasWriteAccess) return true
  return false
}

const PDFDownload = ({ componentRef, form }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const deadline = useSelector(state => state.deadlines.nextDeadline)
  const viewingOldAnswers = useSelector(state => state.form.viewingOldAnswers)
  const programme = useSelector(state => state.studyProgrammes.singleProgram)
  const user = useSelector(state => state.currentUser.data)
  const draftYear = useSelector(state => state.deadlines.draftYear)
  const year = useSelector(state => state.filters.year)

  const handleViewOnlyChange = value => dispatch(setViewOnly(value))

  const userHasWriteAccess =
    isAdmin(user) || (programme && user.access[programme.key] && user.access[programme.key].write)
  let userCanEdit = false
  if (form !== 5 && form !== 6) {
    userCanEdit = !!(userHasWriteAccess && !isFormLocked(form, programme.lockedForms) && deadline && !viewingOldAnswers)
  } else {
    userCanEdit = !!formShouldBeViewOnly({
      draftYear,
      year,
      deadline,
      form,
      user,
      viewingOldAnswers,
      userHasWriteAccess,
    })
  }

  const [isPrinting, setIsPrinting] = useState(false)
  // Store the resolve Promise being used in `onBeforeGetContent` here
  const promiseResolveRef = useRef(null)

  // watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current()
    }
  }, [isPrinting])

  const handleReady = () => {
    promiseResolveRef.current = null
    setIsPrinting(false)
    if (userCanEdit) handleViewOnlyChange(false)
  }

  return (
    <ReactToPrint
      content={() => componentRef.current}
      // eslint-disable-next-line react/no-unstable-nested-components
      trigger={() => <span style={{ cursor: 'pointer', color: colors.blue }}>{t('formView:downloadPDF')}</span>}
      onBeforeGetContent={() =>
        new Promise(resolve => {
          promiseResolveRef.current = resolve
          handleViewOnlyChange(true)
          setIsPrinting(true)
        })
      }
      onAfterPrint={handleReady}
    />
  )
}

export default PDFDownload
