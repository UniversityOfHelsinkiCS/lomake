import React from 'react'
import { Button } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// eslint-disable-next-line react/function-component-definition
export default function SaveIndicator() {
  const { t } = useTranslation()

  const lastSaveSuccess = useSelector(state => state.form.lastSaveSuccess)
  const date = lastSaveSuccess ? new Date(lastSaveSuccess) : null

  const lang = useSelector(state => state.language)
  const viewOnly = useSelector(state => state.form.viewOnly)

  if (viewOnly) return null

  return (
    <Button
      style={{
        position: 'fixed',
        right: '5px',
        bottom: '5px',
        zIndex: 100,
      }}
    >
      {t('lastSaved')} {date ? date.toLocaleTimeString(lang !== 'se' ? lang : 'sv') : ''}
    </Button>
  )
}
