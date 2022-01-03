import React from 'react'
import { Message, Icon } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { HashLink as Link } from 'react-router-hash-link'
import { useLocation } from 'react-router'
import { romanize, colors } from 'Utilities/common'
import { formViewTranslations as translations } from 'Utilities/translations'
import questions from '../../questions.json'

const replaceTitle = {
  'DET ALLMÄNNA LÄGET INOM UTBILDNINGSPROGRAMMET': 'DET ALLMÄNNA LÄGET INOM UTBILDNINGS-\nPROGRAMMET',
  'FAKULTETSÖVERSKRIDANDE PROGRAM': 'FAKULTET-\nSÖVERSKRIDANDE PROGRAM',
  'FRAMGÅNGAR OCH UTVECKLINGSÅTGÄRDER': 'FRAMGÅNGAR OCH UTVECKLING-\nSÅTGÄRDER',
  'PERSONALRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSENLIGHET':
    'PERSONAL-\nRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSENLIGHET',
}

const iconMap = {
  OK: 'check',
  EMPTY: 'exclamation',
}

const NavigationSidebar = ({ programmeKey }) => {
  const lang = useSelector(state => state.language)
  const formData = useSelector(({ form }) => form.data || {})
  const location = useLocation()

  let partNumber = -1
  return (
    <div className="navigation-sidebar">
      <Message style={{ padding: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '99vh' }}>
          {questions.map((section, index) => {
            const titleFromJson = section.title[lang]
            const title = replaceTitle[titleFromJson] ? replaceTitle[titleFromJson] : titleFromJson
            const romanNumeral = romanize(index) || '0'
            const active = location.hash === `#${romanNumeral}`
            return (
              <div
                key={title}
                style={{
                  fontWeight: active ? 'bold' : undefined,
                  padding: '1em',
                  background: active ? colors.background_gray : undefined,
                  borderRadius: '5px',
                  margin: '1px',
                }}
              >
                <div style={{ margin: '1em 0' }}>
                  <Link to={`/form/${programmeKey}#${romanNumeral}`} style={{ color: colors.black }}>
                    {romanNumeral} - {title}
                  </Link>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {section.parts.map(part => {
                    const { id, type, required, no_color } = part
                    if (type === 'ENTITY' || type === 'MEASURES') partNumber++

                    const idsToCheck = []

                    if (type === 'TEXTAREA' || type === 'ENTITY') {
                      idsToCheck.push(`${id}_text`)
                    } else {
                      idsToCheck.push(`${id}_1_text`)
                    }

                    if (type === 'ENTITY' && !no_color) {
                      idsToCheck.push(`${id}_light`)
                    }

                    const status = idsToCheck.reduce((acc, cur) => {
                      if (acc === 'EMPTY') return acc
                      if (!formData[cur]) return 'EMPTY'

                      return 'OK'
                    }, null)

                    const getColor = () => {
                      if (status === 'OK') return colors.green
                      if (status === 'EMPTY' && !required) return colors.black

                      return colors.red
                    }

                    return (
                      <div key={id}>
                        {type === 'ENTITY' && (
                          <>
                            {partNumber}.{' '}
                            <Icon
                              data-cy={`${id}-${status}`}
                              name={iconMap[status]}
                              style={{ color: getColor() }}
                              title={`${translations[status][lang]}${
                                required ? ` (${translations.mandatory_field[lang]})` : ''
                              }`}
                            />
                          </>
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
