import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useReactToPrint } from 'react-to-print'
import { setQuestions } from '../../redux/filterReducer'
import './Generic.scss'
import { Button } from 'semantic-ui-react'

const PDFDownload = ({ componentRef, linkName = null }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isPrinting, setIsPrinting] = useState(false)
  const [title, setTitle] = useState(t('generic:pdfExportText'))
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const { questions, level, faculty, year } = useSelector(state => state.filters)

  const setExportTitle = () => {
    const formText = t('generic:pdfExportText')
    const facultyText = faculty[0] === 'allFaculties' ? '' : faculties.find(f => f.code === faculty).name[lang]
    const levelText = t(level)
    setTitle(`${formText}_${year}_${facultyText}_${levelText}`)
  }

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
    dispatch(setQuestions({ selected: questions.selected, open: [] }))
  }

  const handlePrepare = () => {
    dispatch(setQuestions({ selected: questions.selected, open: questions.selected }))
  }

  const handlePrint = useReactToPrint({
    content: () => {
      return componentRef.current
    },
    documentTitle: title,
    copyStyles: true,
    onBeforeGetContent: async () => {
      handlePrepare()
      setExportTitle()
      return Promise.resolve()
    },
    onBeforePrint: () => {
      setIsPrinting(true)
    },
    onAfterPrint: () => {
      handleReady()
      setIsPrinting(false)
    },
  })
  return (
    <Button onClick={handlePrint}>
      {' '}
      {linkName ? t(`overview:printingPDF:${linkName}`) : t('generic:downloadPDF')}
    </Button>
  )
}

export default PDFDownload
