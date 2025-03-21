/* eslint-disable camelcase */
import React from 'react'
import { Message, Icon } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { HashLink as Link } from 'react-router-hash-link'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { romanize, colors, getProgramAnswerLevels } from '../../util/common'
import { formKeys } from '../../../config/data'
import {
  yearlyQuestions as questions,
  evaluationQuestions,
  facultyEvaluationQuestions,
  universityEvaluationQuestions,
  facultyMonitoringQuestions,
} from '../../questionData'

const replaceTitle = {
  'DET ALLMÄNNA LÄGET INOM UTBILDNINGSPROGRAMMET': 'DET ALLMÄNNA LÄGET INOM UTBILDNINGS-\nPROGRAMMET',
  'FAKULTETSÖVERSKRIDANDE PROGRAM': 'FAKULTET-\nSÖVERSKRIDANDE PROGRAM',
  'FRAMGÅNGAR OCH UTVECKLINGSÅTGÄRDER': 'FRAMGÅNGAR OCH UTVECKLING-\nSÅTGÄRDER',
  'PERSONALRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSENLIGHET':
    'PERSONAL-\nRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSENLIGHET',
}

// These question types are shown in the navigation sidebar
const questionTypesToShow = [
  'ENTITY',
  'META_ENTITY',
  'MEASURES',
  'CHOOSE-RADIO',
  'SELECTION',
  'CHOOSE-ADVANCED',
  'CHECKBOX',
  'ENTITY_LEVELS',
  'ENTITY_UNIVERSITY',
  'FACULTY_ENTITY',
]

const getIcon = filled => (filled ? 'check' : 'exclamation')

const getColor = (filled, required) => {
  if (filled) return colors.green
  if (!filled && !required) return colors.black

  return colors.red
}

const getCorrectRomanNumeral = (number, formType) => {
  if (formType === 'evaluation' || formType === 'meta-evaluation' || formType === 'faculty-monitoring') {
    return romanize(number + 1) || '0'
  }
  return romanize(number) || '0'
}

const getIsCompleted = ({ formData, questionId, getFieldValue }) => {
  const questionData = formData[questionId]
  const fromJson = questionId.endsWith('_selection')

  if (fromJson) {
    const json = JSON.parse(questionData || 'false')
    return json && Object.values(json).some(value => value)
  }

  if (getFieldValue) {
    return questionData
  }

  return Boolean(questionData)
}

const NavigationSidebar = ({ programmeKey, formType, formNumber, questionData }) => {
  const lang = useSelector(state => state.language)
  const form = useSelector(({ form }) => form || {})
  const location = useLocation()
  const { t } = useTranslation()
  let questionsToShow = questions
  let linkBase = ''
  let isDegreeForm = false
  if (formNumber === formKeys.EVALUATION_PROGRAMMES) {
    questionsToShow = evaluationQuestions
    linkBase = `/evaluation/form/${formNumber}/`
  } else if (formNumber === formKeys.EVALUATION_FACULTIES) {
    questionsToShow = facultyEvaluationQuestions
    linkBase = `/evaluation-faculty/form/${formNumber}/`
  } else if (formNumber === formKeys.EVALUATION_COMMTTEES) {
    questionsToShow = universityEvaluationQuestions
    linkBase = `/evaluation-university/form/${formNumber}/`
  } else if (formType === 'degree-reform') {
    questionsToShow = questionData
    linkBase = '/degree-reform/form/'
    isDegreeForm = true
  } else if (formType === 'degree-reform-individual') {
    questionsToShow = questionData
    linkBase = '/individual'
    isDegreeForm = true
  } else if (formType === 'meta-evaluation') {
    questionsToShow = questionData
  } else if (formType === 'faculty-monitoring') {
    linkBase = `/faculty-monitoring/form/${formNumber}/`
    questionsToShow = facultyMonitoringQuestions
  } else if (formType === formKeys.YEARLY_ASSESSMENT) {
    linkBase = `/yearly/form/${formNumber}`
  }

  let formDataFilter = []
  if (programmeKey) {
    formDataFilter = getProgramAnswerLevels(programmeKey)
  } else {
    formDataFilter = form.answerLevels && form.answerLevels.length > 0 ? form.answerLevels : null
  }

  let partNumber =
    formType === 'evaluation' || formType === 'meta-evaluation' || formType === 'faculty-monitoring' ? 0 : -1

  return (
    <div className="navigation-sidebar">
      <Message style={{ padding: 0 }}>
        <div
          key={`navigation-sidebar-list-${formType}-${lang}}`}
          data-cy="navigation-sidebar-list"
          style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '99vh' }}
        >
          {questionsToShow.map((section, index) => {
            if (isDegreeForm) {
              partNumber = 0
            }
            const titleFromJson = section.title[lang]
            const title = replaceTitle[titleFromJson] ? replaceTitle[titleFromJson] : titleFromJson
            const romanNumeral = getCorrectRomanNumeral(index, formType)
            const active = location.hash === `#${romanNumeral}`
            if (formDataFilter && formDataFilter.find(f => f === section.id)) {
              return null
            }
            const link =
              formType === 'degree-reform-individual'
                ? `${linkBase}#${romanNumeral}`
                : `${linkBase}${programmeKey}#${romanNumeral}`
            return (
              <div
                key={`${section.id}-${title}`}
                style={{
                  fontWeight: active ? 'bold' : undefined,
                  padding: '1em',
                  background: active ? colors.background_gray : undefined,
                  borderRadius: '5px',
                  margin: '1px',
                }}
                data-cy={`navigation-sidebar-section-${section.id}`}
              >
                <div style={{ margin: '1em 0' }}>
                  <Link to={link} style={{ color: colors.black }}>
                    {title}
                  </Link>
                </div>
                <div id={`question-list-${section.id}`} style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {section.parts
                    .filter(part => questionTypesToShow.includes(part.type))
                    .map(part => {
                      if (formType === 'degree-reform') {
                        if (part.notInProgrammeView !== undefined || part.notInProgrammeView === true) {
                          return null
                        }
                      }
                      partNumber++
                      const { id, type, required, no_color } = part
                      const idsToCheck = []
                      if (
                        type === 'TEXTAREA' ||
                        type === 'ENTITY' ||
                        type === 'SELECTION' ||
                        type === 'ENTITY_LEVELS' ||
                        type === 'ENTITY_UNIVERSITY'
                      ) {
                        idsToCheck.push(`${id}_text`)
                      } else if (type === 'CHOOSE-RADIO' || type === 'CHOOSE-ADVANCED' || type === 'CHECKBOX') {
                        idsToCheck.push(`${id}`)
                      } else if (type === 'FACULTY_ENTITY') {
                        idsToCheck.push(
                          `${id}_actions_text`,
                          `${id}_responsible_entities_text`,
                          `${id}_contact_person_text`,
                          `${id}_resources_text`,
                          `${id}_start_date_text`,
                          `${id}_end_date_text`,
                        )
                      } else if (type === 'META_ENTITY') {
                        idsToCheck.push(`${id}_light`)

                        const lightColor = getIsCompleted({
                          formData: form.data,
                          questionId: `${id}_light`,
                          getFieldValue: true,
                        })

                        if (lightColor === 'gray') {
                          idsToCheck.push(`${id}_comment_text`)
                        } else {
                          idsToCheck.push(`${id}_text`)
                        }
                      } else {
                        idsToCheck.push(`${id}_1_text`)
                      }

                      if (type === 'ENTITY' && !no_color) {
                        idsToCheck.push(`${id}_light`)
                      }
                      if (type === 'ENTITY_LEVELS' || type === 'ENTITY_UNIVERSITY') {
                        idsToCheck.push(`${id}_bachelor_light`)
                        if (programmeKey !== 'H74') {
                          idsToCheck.push(`${id}_master_light`)
                          idsToCheck.push(`${id}_doctoral_light`)
                        }
                      }

                      if (type === 'SELECTION') {
                        idsToCheck.push(`${id}_selection`)
                      }

                      const comparator = type.includes('ENTITY') ? 'every' : 'some'

                      const filled = idsToCheck[comparator](id =>
                        getIsCompleted({
                          formData: form.data,
                          questionId: id,
                        }),
                      )

                      return (
                        <div key={`${id}-${lang}`}>
                          {questionTypesToShow.includes(type) && (
                            <>
                              {partNumber}.
                              <Icon
                                data-cy={`${id}-${filled ? 'OK' : 'EMPTY'}`}
                                name={getIcon(filled)}
                                style={{ color: getColor(filled, required) }}
                                title={`${t(filled ? 'OK' : 'EMPTY')}${
                                  required ? ` (${t('formView:mandatory')})` : ''
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
