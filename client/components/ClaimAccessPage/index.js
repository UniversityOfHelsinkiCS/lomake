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
  promptFaculty: {
    fi: 'Olet vastaanottamassa lukuoikeudet seuraaviin koulutusohjelmiin: ',
    en: 'You are claiming read-permissions for the following studyprogrammes: ',
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
  claimPermissions: {
    en: 'Form - Claim permissions',
    fi: 'Lomake - Vastaanota oikeuksia',
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
  const [localizedProgramname, setLocalizedProgramname] = useState('')
  const token = useSelector((store) => store.accessToken)
  const languageCode = useSelector((state) => state.language)
  const studyProgrammes = useSelector((state) => state.studyProgrammes.data)
  const faculties = useSelector((state) => state.faculties.data)
  const [value, setValue] = useState('')

  useEffect(() => {
    document.title = `${translations['claimPermissions'][languageCode]}`
  }, [languageCode])

  useEffect(() => {
    if (studyProgrammes && token.data) {
      if (token.data.programme) {
        const program = studyProgrammes.find((p) => p.key === token.data.programme)

        const temp = program['name'][languageCode]
          ? program['name'][languageCode]
          : program['name']['en']

        setLocalizedProgramname(temp)
      } else {
        setLocalizedProgramname(token.data.faculty)
      }
    }
  }, [languageCode, token, studyProgrammes])

  useEffect(() => {
    dispatch(getTokenAction(url))
  }, [])

  const handleClaim = (token) => {
    if (token.programme) {
      dispatch(claimTokenAction(url, false))
    } else {
      dispatch(claimTokenAction(url, true))
    }
  }

  const buttonIsDisabled = () => {
    if (['WRITE', 'READ'].includes(token.data.type)) {
      return false
    }

    const normalizedProgrammeName = localizedProgramname
      .toLowerCase()
      .replace(',', '')
      .replace("'", '')
      .replace('’', '')
    const normalizedInput = value.toLowerCase().replace(',', '').replace("'", '').replace('’', '')

    return normalizedProgrammeName !== normalizedInput
  }

  if (!token.data && token.error)
    return <span style={{ color: 'red' }}>{translations.invalidToken[languageCode]}</span>

  if (!token.data || !faculties) return <Loader active inline />

  const getFacultyMessageContent = () => {
    const programeCodes = faculties.find((f) => f.code === token.data.faculty).programmes
    const localizedProgrammeCodes = programeCodes.map((pCode) => {
      const prog = studyProgrammes.find((p) => p.key === pCode)
      return prog.name[languageCode]
    })
    return translations.promptFaculty[languageCode] + localizedProgrammeCodes.join(', ')
  }

  return (
    <div style={{ width: '50em', margin: '1em auto' }}>
      <Message
        color="blue"
        icon="exclamation"
        content={
          token.data.programme ? translations.prompt[languageCode] : getFacultyMessageContent()
        }
      />
      {token.data.programme ? (
        <div style={{ fontWeight: 'bold' }}>{localizedProgramname}</div>
      ) : (
        <div style={{ fontWeight: 'bold' }}>
          {faculties.find((f) => f.code === token.data.faculty).name}
        </div>
      )}
      <div style={{ fontSize: '1.5em', fontWeight: 'bolder', height: '1.25em', margin: '0.5em 0' }}>
        <Icon color="blue" name={labelIcon[token.data.type]} size="small" />{' '}
        {translations.rights[token.data.type][languageCode]}
      </div>
      {token.data.type === 'ADMIN' && (
        <div style={{ margin: '1.2em 0' }}>
          <Input
            style={{ width: '700px' }}
            size="large"
            placeholder={localizedProgramname}
            value={value}
            onChange={(e, { value }) => setValue(value)}
          />
          <div className={`claimAccesspage-adminMessage ${buttonIsDisabled() ? 'error' : 'valid'}`}>
            {translations.confirmPrompt[languageCode]}
          </div>
        </div>
      )}
      <Button disabled={buttonIsDisabled()} onClick={() => handleClaim(token.data)}>
        {translations.buttonText[languageCode]}
      </Button>{' '}
    </div>
  )
}
