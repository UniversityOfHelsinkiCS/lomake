/* eslint-disable camelcase */
import React from 'react'
import { Message, Icon } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { HashLink as Link } from 'react-router-hash-link'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { romanize, colors, getProgramAnswerLevels } from 'Utilities/common'
import questions from '../../questions.json'
import evaluationQuestions from '../../evaluationQuestions.json'
import degreeReformQuestions from '../../degreeReformQuestions.json'
import degreeReformIndividualQuestions from '../../degreeReformIndividualQuestions.json'

const replaceTitle = {
  'DET ALLMÄNNA LÄGET INOM UTBILDNINGSPROGRAMMET': 'DET ALLMÄNNA LÄGET INOM UTBILDNINGS-\nPROGRAMMET',
  'FAKULTETSÖVERSKRIDANDE PROGRAM': 'FAKULTET-\nSÖVERSKRIDANDE PROGRAM',
  'FRAMGÅNGAR OCH UTVECKLINGSÅTGÄRDER': 'FRAMGÅNGAR OCH UTVECKLING-\nSÅTGÄRDER',
  'PERSONALRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSENLIGHET':
    'PERSONAL-\nRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSENLIGHET',
}

// These question types are shown in the navigation sidebar
const questionTypesToShow = ['ENTITY', 'MEASURES', 'CHOOSE-RADIO', 'SELECTION', 'CHOOSE-ADVANCED', 'CHECKBOX']

const getIcon = filled => (filled ? 'check' : 'exclamation')

const getColor = (filled, required) => {
  if (filled) return colors.green
  if (!filled && !required) return colors.black

  return colors.red
}

const getCorrectRomanNumeral = (number, formType) => {
  if (formType === 'evaluation') {
    return romanize(number + 1) || '0'
  }
  return romanize(number) || '0'
}

const getIsCompleted = ({ formData, questionId }) => {
  const questionData = formData[questionId]
  const fromJson = questionId.endsWith('_selection')

  if (fromJson) {
    const json = JSON.parse(questionData || 'false')
    return json && Object.values(json).some(value => value)
  }

  return Boolean(questionData)
}

const NavigationSidebar = ({ programmeKey, formType, formNumber }) => {
  const lang = useSelector(state => state.language)
  const form = useSelector(({ form }) => form || {})
  const location = useLocation()
  const { t } = useTranslation()

  let questionsToShow = questions
  let linkBase = '/form/'
  let isDegreeForm = false
  if (formType === 'evaluation') {
    questionsToShow = evaluationQuestions
    linkBase = `/evaluation/form/${formNumber}/`
  } else if (formType === 'degree-reform') {
    questionsToShow = degreeReformQuestions
    linkBase = '/degree-reform/form/'
    isDegreeForm = true
  } else if (formType === 'degree-reform-individual') {
    questionsToShow = degreeReformIndividualQuestions
    linkBase = '/degree-reform-individual/form/'
    isDegreeForm = true
  }

  let formDataFilter = []
  if (programmeKey) {
    formDataFilter = getProgramAnswerLevels(programmeKey)
  } else {
    formDataFilter = form.answerLevels && form.answerLevels.length > 0 ? form.answerLevels : null
  }

  let partNumber = formType === 'evaluation' ? 0 : -1
  return (
    <div className="navigation-sidebar">
      <Message style={{ padding: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '99vh' }}>
          {questionsToShow.map((section, index) => {
            if (isDegreeForm) {
              partNumber = 0
            }
            const titleFromJson = section.title[lang]
            const title = replaceTitle[titleFromJson] ? replaceTitle[titleFromJson] : titleFromJson
            const romanNumeral = getCorrectRomanNumeral(index, formType)
            const active = location.hash === `#${romanNumeral}`
            if (formDataFilter && formDataFilter.find(f => f === section.id)) {
              return <div key={`${section.title}-${section.id}`} />
            }
            const link =
              formType === 'degree-reform-individual'
                ? `${linkBase}#${romanNumeral}`
                : `${linkBase}${programmeKey}#${romanNumeral}`
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
                  <Link to={link} style={{ color: colors.black }}>
                    {title}
                  </Link>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {section.parts
                    .filter(part => questionTypesToShow.includes(part.type))
                    .map(part => {
                      partNumber++
                      const { id, type, required, no_color } = part

                      const idsToCheck = []
                      if (type === 'TEXTAREA' || type === 'ENTITY' || type === 'SELECTION') {
                        idsToCheck.push(`${id}_text`)
                      } else if (type === 'CHOOSE-RADIO' || type === 'CHOOSE-ADVANCED' || type === 'CHECKBOX') {
                        idsToCheck.push(`${id}`)
                      } else {
                        idsToCheck.push(`${id}_1_text`)
                      }

                      if (type === 'ENTITY' && !no_color) {
                        idsToCheck.push(`${id}_light`)
                      }

                      if (type === 'SELECTION') {
                        idsToCheck.push(`${id}_selection`)
                      }

                      const comparator = type === 'ENTITY' ? 'every' : 'some'

                      const filled = idsToCheck[comparator](id =>
                        getIsCompleted({
                          formData: form.data,
                          questionId: id,
                        })
                      )

                      return (
                        <div key={id}>
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
