import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTokenAction, claimTokenAction } from 'Utilities/redux/accessTokenReducer'
import { Button, Message, Icon, Input, Loader } from 'semantic-ui-react'

const translations = {
  prompt: {
    fi: 'Olet vastaanottamassa oikeuksia',
    en: 'You are claiming permissions',
    se: '',
  },
  buttonText: {
    fi: 'Vastaanota',
    en: 'Claim',
    se: '',
  },
  confirmPrompt: {
    fi: 'Ole hyvä ja kirjoita ohjelman nimi yllä olevaan laatikkoon varmistusta varten',
    en: "Please write the programme's name to the input above to confirm",
    se: '',
  },
  rights: {
    ADMIN: {
      fi: 'Ylläpitäjän oikeudet',
      en: 'Admin access',
      se: '',
    },
    WRITE: {
      fi: 'Vastausoikeudet',
      en: 'Edit access',
      se: '',
    },
    READ: {
      fi: 'Lukuoikeudet',
      en: 'Read access',
      se: '',
    },
  },
  invalidToken: {
    fi:
      'Virhe: Käyttämäsi linkki ei ole enää voimassa. Ole hyvä ja ota yhteys koulutusohjelmasi johtajaan uutta linkkiä varten.',
    en:
      'Error: The url you tried to access in no longer valid. Please contact your study programme leader for a new one.',
    se: '',
  },
}

const labelIcon = {
  ADMIN: 'key',
  WRITE: 'write',
  READ: 'eye',
}

export default ({ url }) => {
  const dispatch = useDispatch()
  const token = useSelector((store) => store.accessToken)
  const languageCode = useSelector((state) => state.language)
  const [value, setValue] = useState('')

  useEffect(() => {
    dispatch(getTokenAction(url))
  }, [])

  const handleClaim = () => {
    dispatch(claimTokenAction(url))
  }

  const buttonIsDisabled = () => {
    if (['WRITE', 'READ'].includes(token.data.type)) {
      return false
    }

    const normalizedProgrammeName = token.data.programme
      .toLowerCase()
      .replace(',', '')
      .replace("'", '')
      .replace('’', '')
    const normalizedInput = value.toLowerCase().replace(',', '').replace("'", '').replace('’', '')

    return normalizedProgrammeName !== normalizedInput
  }

  if (!token.data && token.error)
    return <span style={{ color: 'red' }}>{translations.invalidToken[languageCode]}</span>

  if (!token.data) return <Loader active inline />

  return (
    <div style={{ width: '50em', margin: '1em auto' }}>
      <Message color="blue" icon="exclamation" content={translations.prompt[languageCode]} />
      <div style={{ fontWeight: 'bold' }}>{token.data.programme}</div>
      <div style={{ fontSize: '1.5em', fontWeight: 'bolder', height: '1.25em', margin: '0.5em 0' }}>
        <Icon color="blue" name={labelIcon[token.data.type]} size="small" />{' '}
        {translations.rights[token.data.type][languageCode]}
      </div>
      {token.data.type === 'ADMIN' && (
        <div style={{ margin: '1.2em 0' }}>
          <Input
            style={{ width: '700px' }}
            size="large"
            placeholder={token.data.programme}
            value={value}
            onChange={(e, { value }) => setValue(value)}
          />
          <div className={`claimAccesspage-adminMessage ${buttonIsDisabled() ? 'error' : 'valid'}`}>
            {translations.confirmPrompt[languageCode]}
          </div>
        </div>
      )}
      <Button disabled={buttonIsDisabled()} onClick={() => handleClaim()}>
        {translations.buttonText[languageCode]}
      </Button>{' '}
    </div>
  )
}
