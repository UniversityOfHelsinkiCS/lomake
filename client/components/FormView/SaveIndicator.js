import React, { useState, useEffect } from 'react'
import { Button, Loader } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

let timeoutId
export default function SaveIndicator() {
  const [saving, setSaving] = useState(false)
  const lastSaved = useSelector((state) => state.form.lastSaved)
  const languageCode = useSelector((state) => state.language)
  const viewOnly = useSelector((state) => state.form.viewOnly)

  const translations = {
    lastSaved: {
      en: 'Last saved at:',
      fi: 'Viimeksi tallennettu kello:',
      se: '',
    },
  }

  useEffect(() => {
    setSaving(true)
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      setSaving(false)
    }, 1000)
  }, [lastSaved])

  if (viewOnly) return null

  return (
    <>
      <Button
        style={{
          position: 'fixed',
          right: '5px',
          bottom: '5px',
          zIndex: 100,
        }}
        loading={saving}
        positive
      >
        {translations['lastSaved'][languageCode]}{' '}
        {lastSaved.toLocaleTimeString(languageCode !== 'se' ? languageCode : 'sv')}
      </Button>
    </>
  )
}
