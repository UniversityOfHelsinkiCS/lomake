import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import { isAdmin } from '../../../config/common'
import { Button } from '@mui/material'

const PDFDownload = ({ componentRef }) => {
  const { t } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const [isPrinting, setIsPrinting] = useState(false)
  // Store the resolve Promise being used in `onBeforeGetContent` here
  const promiseResolveRef = useRef(null)
  // watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current()
    }
  }, [isPrinting])

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Formview',
    onBeforePrint: () => {
      return new Promise(resolve => {
        promiseResolveRef.current = resolve
        setIsPrinting(true)
      })
    },
    onAfterPrint: () => {
      setIsPrinting(false)
      promiseResolveRef.current = null
    },
  })

  return isAdmin(user) ? (
    <div>
      <Button onClick={handlePrint}>{t('formView:downloadPDF')}</Button>
    </div>
  ) : null
}

export default PDFDownload
