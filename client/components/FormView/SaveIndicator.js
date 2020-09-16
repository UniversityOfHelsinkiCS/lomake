import React, { useState, useEffect } from 'react'
import { Button, Message, Icon } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { colors } from 'Utilities/common'
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
      se: 'Senast sparad kl.',
    },
    saveFailed: {
      header: {
        en: 'Error: The changes you have made in the last 10 seconds have not been saved!',
        fi:
          'Virhe: Viimeisen 10 sekunnin aikana tekemäsi muutokset eivät tallentuneet onnistuneesti!',
        se: '',
      },
      content: {
        en:
          'In order to continue filling the form, please backup any recent changes you have made. Then click the button to reload the page.',
        fi:
          'Jatkaaksesi lomakkeen täyttämistä, ole hyvä ja ota viimeiset muutoksesi talteen. Klikkaa sen jälkeen allaolevaa näppäintä ladataksesi sivu uudelleen.',
        se: '',
      },
      button: {
        en: 'Reload the page',
        fi: 'Lataa sivu uudelleen',
        se: '',
      },
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
        <Message
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
          header={`${translations.saveFailed.header[languageCode]}`}
          content={
            <div style={{ paddingTop: '1em' }}>
              <span>{translations.saveFailed.content[languageCode]}</span>
              <Button
                style={{ marginTop: '2em', float: 'right' }}
                color="blue"
                onClick={() => window.location.reload()}
              >
                {translations.saveFailed.button[languageCode]}
              </Button>
            </div>
          }
        ></Message>
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
