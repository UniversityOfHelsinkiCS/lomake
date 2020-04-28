import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setViewOnly } from 'Utilities/redux/formReducer'

const translations = {
  downloadText: {
    fi: 'Tulosta / Lataa vastaukset PDF-tiedostona',
    en: 'Print / Download answers as PDF file',
    se: ''
  },
  setViewOnlyTrueText: {
    fi: 'Tulostus/PDF -näkymä',
    en: 'Print/Download as PDF view',
    se: ''
  },
  setViewOnlyFalseText: {
    fi: 'Palaa täyttämään lomaketta',
    en: 'Back to edit view',
    se: ''
  }
}

const PDFDownload = () => {
  const languageCode = useSelector((state) => state.language)
  const dispatch = useDispatch()
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const handleViewOnlyChange = (value) => dispatch(setViewOnly(value))
  const programme = useSelector((state) => state.studyProgrammes.singleProgram)
  const user = useSelector((state) => state.currentUser.data)

  const userHasWriteAccess =
    user.admin || (user.access[programme.key] && user.access[programme.key].write)
  const showGoBackToEditButton = userHasWriteAccess && !programme.locked ? true : false

  return (
    <>
      {viewOnly ? (
        <>
          {showGoBackToEditButton && (
            <>
              <span
                data-cy="pdfdownload-go-back-button"
                style={{ cursor: 'pointer', color: '#4183C4' }}
                onClick={() => {
                  handleViewOnlyChange(false)
                }}
              >
                {translations.setViewOnlyFalseText[languageCode]}
              </span>
              <span style={{ margin: '0 0.5em', color: 'grey' }}>|</span>
            </>
          )}
          <span
            style={{ cursor: 'pointer', color: '#4183C4' }}
            onClick={() => {
              window.print()
            }}
          >
            {translations.downloadText[languageCode]}
          </span>
        </>
      ) : (
        <>
          <span
            data-cy="pdfdownload-go-to-readmode"
            style={{ cursor: 'pointer', color: '#4183C4' }}
            onClick={() => {
              handleViewOnlyChange(true)
            }}
          >
            {translations.setViewOnlyTrueText[languageCode]}
          </span>
        </>
      )}
    </>
  )
}

export default PDFDownload
