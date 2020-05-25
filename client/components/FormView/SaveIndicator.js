import React, { useState, useEffect } from 'react'
import { Button, Loader } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { setViewOnly } from 'Utilities/redux/formReducer'

export default function SaveIndicator() {
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [timeoutId, setTimeoutId] = useState(undefined)

  const lastSaveSuccess = useSelector((state) => state.form.lastSaveSuccess)
  const lastSaveAttempt = useSelector((state) => state.form.lastSaveAttempt)

  const languageCode = useSelector((state) => state.language)
  const viewOnly = useSelector((state) => state.form.viewOnly)
  const dispatch = useDispatch()

  const translations = {
    lastSaved: {
      en: 'Last saved at:',
      fi: 'Viimeksi tallennettu kello:',
      se: '',
    },
    saveFailed: {
      en:
        'The changes you have made in the last 10 seconds have not been saved! Please backup your work and reload the page to continue.',
      fi:
        'Viimeisen 10 sekunnin aikana tekemäsi muutokset eivät tallentuneet onnistuneesti! Ota muutoksesi talteen ja päivitä sivu.',
      se: '',
    },
  }

  const errorHandler = () => {
    setSaveError(true)
    setTimeoutId(undefined)
    dispatch(setViewOnly(true))
  }

  useEffect(() => {
    setSaving(true)
    if (timeoutId || viewOnly) return

    const temp = setTimeout(() => {
      errorHandler()
    }, 10000)
    setTimeoutId(temp)
  }, [lastSaveAttempt])

  useEffect(() => {
    if (saving) {
      setSaving(false)
      clearTimeout(timeoutId)
      setTimeoutId(undefined)
    }
  }, [lastSaveSuccess])

  if (viewOnly && !saveError) return null

  if (saveError) {
    return (
      <>
        <Button
          negative
          style={{
            position: 'fixed',
            right: '25%',
            top: '50px',
            height: '100px',
            zIndex: 100,
            width: '50%',
          }}
        >
          {translations.saveFailed[languageCode]}
        </Button>
      </>
    )
  }
  return (
    <>
      <Button
        style={{
          position: 'fixed',
          right: '5px',
          bottom: '5px',
          zIndex: 100,
        }}
        //loading={saving}
      >
        {translations['lastSaved'][languageCode]}{' '}
        {lastSaveSuccess.toLocaleTimeString(languageCode !== 'se' ? languageCode : 'sv')}
      </Button>
    </>
  )
}
