/* eslint-disable camelcase */
import React from 'react'
import { Card } from '@mui/material'
import { useSelector } from 'react-redux'
import { HashLink as Link } from 'react-router-hash-link'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { romanize, colors } from 'Utilities/common'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import CheckIcon from '@mui/icons-material/Check'
import questions from '../../questions.json'
import katselmusQuestions from '../../katselmusQuestions.json'
import koulutusuudistusQuestions from '../../koulutusuudistusQuestions.json'

const replaceTitle = {
  'DET ALLMÄNNA LÄGET INOM UTBILDNINGSPROGRAMMET': 'DET ALLMÄNNA LÄGET INOM UTBILDNINGS-\nPROGRAMMET',
  'FAKULTETSÖVERSKRIDANDE PROGRAM': 'FAKULTET-\nSÖVERSKRIDANDE PROGRAM',
  'FRAMGÅNGAR OCH UTVECKLINGSÅTGÄRDER': 'FRAMGÅNGAR OCH UTVECKLING-\nSÅTGÄRDER',
  'PERSONALRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSENLIGHET':
    'PERSONAL-\nRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSENLIGHET',
}

const iconMap = {
  OK: <CheckIcon />,
  EMPTY: <PriorityHighIcon />,
}

const NavigationSidebar = ({ programmeKey, form }) => {
  const lang = useSelector(state => state.language)
  const formData = useSelector(({ form }) => form.data || {})
  const location = useLocation()
  const { t } = useTranslation()

  let questionsToShow = questions
  let linkBase = '/form/'

  if (form === 'evaluation') {
    questionsToShow = katselmusQuestions
    linkBase = '/evaluation/form/'
  } else if (form === 'degree-reform') {
    questionsToShow = koulutusuudistusQuestions
    linkBase = '/degree-reform/form/'
  } else if (form === 'degree-reform-individual') {
    questionsToShow = koulutusuudistusQuestions
    linkBase = '/degree-reform-individual/form'
  }

  let partNumber = -1
  return (
    <div className="navigation-sidebar">
      <Card style={{ padding: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '99vh' }}>
          {questionsToShow.map((section, index) => {
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
                  <Link to={`${linkBase}${programmeKey}#${romanNumeral}`} style={{ color: colors.black }}>
                    {romanNumeral} - {title}
                  </Link>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {section.parts.map(part => {
                    const { id, type, required, no_color } = part
                    if (type === 'ENTITY' || type === 'MEASURES' || type === 'CHOOSE-RADIO' || type === 'SLIDER')
                      partNumber++

                    const idsToCheck = []

                    if (type === 'TEXTAREA' || type === 'ENTITY') {
                      idsToCheck.push(`${id}_text`)
                    } else if (type === 'CHOOSE-RADIO') {
                      idsToCheck.push(`${id}`)
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
                        {(type === 'ENTITY' || type === 'SLIDER' || type === 'CHOOSE-RADIO') && (
                          <>
                            <div style={{ display: 'flex' }}>
                              {partNumber}.{' '}
                              <div
                                data-cy={`${id}-${status}`}
                                style={{ color: getColor() }}
                                title={`${t(status)}${required ? ` (${t('formView:mandatory')})` : ''}`}
                              >
                                {iconMap[status]}
                              </div>
                            </div>
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
      </Card>
    </div>
  )
}

export default NavigationSidebar
