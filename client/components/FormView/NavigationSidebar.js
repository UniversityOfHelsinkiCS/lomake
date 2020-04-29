import React from 'react'
import questions from '../../questions.json'
import { Message, Icon } from 'semantic-ui-react'
import { romanize } from 'Utilities/common'
import { useSelector } from 'react-redux'
import { HashLink as Link } from 'react-router-hash-link'
import { useLocation } from 'react-router'
import { colors } from 'Utilities/common'

const translations = {
  OK: {
    fi: 'Vastattu',
    en: 'Answer given',
    se: '',
  },
  EMPTY: {
    fi: 'Ei vastausta',
    en: "There's no answer",
    se: '',
  },
  ERROR: {
    fi: 'Liian pitkä vastaus',
    en: 'Answer is too long',
    se: '',
  },
  mandatory_field: {
    fi: 'pakollinen kenttä',
    en: 'required field',
    se: '',
  },
}

const replaceTitle = {
  'DET ALLMÄNNA LÄGET INOM UTBILDNINGSPROGRAMMET':
    'DET ALLMÄNNA LÄGET INOM UTBILDNINGS-\nPROGRAMMET',
  'FAKULTETSÖVERSKRIDANDE PROGRAM': 'FAKULTET-\nSÖVERSKRIDANDE PROGRAM',
  'FRAMGÅNGAR OCH UTVECKLINGSÅTGÄRDER': 'FRAMGÅNGAR OCH UTVECKLING-\nSÅTGÄRDER',
  'PERSONALRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSENLIGHET':
    'PERSONAL-\nRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSENLIGHET',
}

const iconMap = {
  ERROR: 'close',
  OK: 'check',
  EMPTY: 'exclamation',
}

const NavigationSidebar = ({ programmeKey, lastSaved, deadline }) => {
  const languageCode = useSelector((state) => state.language)
  const formData = useSelector(({ form }) => form.data || {})
  const location = useLocation()

  let partNumber = -1
  return (
    <div className="navigation-sidebar">
      <Message style={{ padding: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {questions.map((section, index) => {
            const titleFromJson = section.title[languageCode]
            const title = replaceTitle[titleFromJson] ? replaceTitle[titleFromJson] : titleFromJson
            const romanNumeral = romanize(index) || '0'
            const active = location.hash === `#${romanNumeral}`
            return (
              <div
                key={title}
                style={{
                  fontWeight: active ? 'bold' : undefined,
                  padding: '1em',
                  background: active ? '#e0e0e0' : undefined,
                  borderRadius: '5px',
                  margin: '1px',
                }}
              >
                <div style={{ margin: '1em 0' }}>
                  <Link to={`/form/${programmeKey}#${romanNumeral}`} style={{ color: 'black' }}>
                    {romanNumeral} - {title}
                  </Link>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {section.parts.map((part) => {
                    const { id, type, required, no_light } = part
                    if (type === 'ENTITY') partNumber++

                    const idsToCheck = []

                    if (type === 'TEXTAREA' || type === 'ENTITY') {
                      idsToCheck.push(`${id}_text`)
                    } else {
                      idsToCheck.push(`${id}_1_text`)
                    }

                    if (type === 'ENTITY' && !no_light) {
                      idsToCheck.push(`${id}_light`)
                    }

                    const status = idsToCheck.reduce((acc, cur) => {
                      //ERROR is the most important status
                      if (acc === 'ERROR') return acc
                      if (formData[cur] && formData[cur].length > 1000) {
                        return 'ERROR'
                      }

                      //EMPTY is the second most important status
                      if (acc === 'EMPTY') return acc
                      if (!formData[cur]) return 'EMPTY'

                      return 'OK'
                    }, null)

                    const getColor = () => {
                      if (status === 'OK') return 'green'
                      if (status === 'EMPTY' && !required) return 'black'

                      return 'red'
                    }

                    return (
                      <div key={id}>
                        {type === 'ENTITY' && <>{partNumber}.</>}{' '}
                        {(type === 'ENTITY' || status === 'ERROR') && (
                          <Icon
                            name={iconMap[status]}
                            style={{ color: getColor() }}
                            title={`${translations[status][languageCode]}${
                              required ? ` (${translations.mandatory_field[languageCode]})` : ''
                            }`}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Message>
    </div>
  )
}

export default NavigationSidebar
