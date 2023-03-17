import React, { useState, useEffect } from 'react'
import { Button, Card, Icon } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { colors } from 'Utilities/common'
import { setViewOnly } from 'Utilities/redux/formReducer'

export default function SaveIndicator() {
  const { t } = useTranslation()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [timeoutId, setTimeoutId] = useState(undefined)

  const lastSaveSuccess = useSelector(state => state.form.lastSaveSuccess)
  const lastSaveAttempt = useSelector(state => state.form.lastSaveAttempt)

  const lang = useSelector(state => state.language)
  const viewOnly = useSelector(state => state.form.viewOnly)
  const dispatch = useDispatch()

  const errorHandler = () => {
    if (viewOnly) return
    setSaveError(true)
    setTimeoutId(undefined)
    dispatch(setViewOnly(true))
  }

  useEffect(() => {
    setSaving(true)
    if (timeoutId || viewOnly) return undefined

    const temp = setTimeout(() => {
      errorHandler()
    }, 10000)
    setTimeoutId(temp)

    return () => {
      clearTimeout(temp)
    }
  }, [lastSaveAttempt, viewOnly])

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
        <Card
          negative
          icon={<Icon color={colors.red} name="exclamation" />}
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translate(-50%)',
            top: '5em',
            zIndex: 100,
            width: '75%',
            maxWidth: '50em',
          }}
          header={`${t('formView:saveFailed')}`}
          content={
            <div style={{ paddingTop: '1em' }}>
              <span>{t('formView:saveFailedInstructions')}</span>
              <Button
                style={{ marginTop: '2em', float: 'right' }}
                color="blue"
                onClick={() => window.location.reload()}
              >
                {t('formView:reload')}
              </Button>
            </div>
          }
        />
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
      >
        {t('lastSaved')} {lastSaveSuccess.toLocaleTimeString(lang !== 'se' ? lang : 'sv')}
      </Button>
    </>
  )
}
