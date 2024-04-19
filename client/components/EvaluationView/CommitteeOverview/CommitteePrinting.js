import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formKeys } from '@root/config/data'
import { Loader } from 'semantic-ui-react'
import { answersByYear, getYearToShow, isEvaluationUniversityUser } from 'Utilities/common'
import { useTranslation } from 'react-i18next'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import ReactMarkdown from '@root/node_modules/react-markdown/index'
import { universityEvaluationQuestions as questions } from '@root/client/questionData'
import PDFDownload from 'Components/Generic/PDFDownload'

import { getActionsAnswerForUniversity } from './Square'

const StudyLevelContainer = ({ answerLevels }) => {
  const { t } = useTranslation()
  return answerLevels.map(upperLevel => {
    return (
      <div>
        <h2 style={{ textAlign: 'center' }}>{t('overview:printingTopHeader')}</h2>
        {upperLevel.levels.length === 1 && (
          <h2 style={{ textAlign: 'center' }}>{t(`overview:selectedLevels:${upperLevel.levels[0]}`)}</h2>
        )}
        <h2 style={{ textAlign: 'center' }}>{t(`overview:printingSubHeaderUpperLevel:${upperLevel.title}`)}</h2>
        {upperLevel.levels.map(level => {
          return questions.map((theme, themeIndex) => {
            return <ThemeContainer upperLevel={upperLevel.title} level={level} theme={theme} themeIndex={themeIndex} />
          })
        })}
      </div>
    )
  })
}

const ThemeContainer = ({ upperLevel, theme, level, themeIndex }) => {
  const lang = useSelector(state => state.language)
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const answers = useSelector(state => state.tempAnswers)
  const oldAnswers = useSelector(state => state.oldAnswers)
  const year = getYearToShow({ draftYear, nextDeadline, form: formKeys.EVALUATION_COMMTTEES })
  const { t } = useTranslation()

  let answerLength = 0

  return (
    <div style={{ margin: '1em' }} className="university-printing-wrapper">
      <div className="uni-print-theme-parts">
        {theme.parts.map((question, index) => {
          if (question.id === 'meta2' || question.id === 'university_where_are_we_in_five_years_opinion_differences') {
            return null
          }
          const showThemeTitle = index === 0
          const questionLabel = question.shortLabel ? question.shortLabel[lang] : question.label[lang]
          const questionLabelCorrectCase = questionLabel.charAt(0).toUpperCase() + questionLabel.toLowerCase().slice(1)

          const selectedAnswers = answersByYear({
            year,
            tempAnswers: answers,
            oldAnswers,
            draftYear: draftYear && draftYear.year,
            deadline: nextDeadline?.find(d => d.form === formKeys.EVALUATION_COMMTTEES),
            form: formKeys.EVALUATION_COMMTTEES,
          })

          let formLanguageVersion = 'UNI'

          if (lang === 'en') {
            formLanguageVersion = 'UNI_EN'
          } else if (lang === 'se') {
            formLanguageVersion = 'UNI_SE'
          }

          let filteredAnswers = selectedAnswers && selectedAnswers.find(a => a.programme === formLanguageVersion)
          if (!filteredAnswers?.data) {
            filteredAnswers = []
          } else {
            filteredAnswers = filteredAnswers.data
          }

          const completeQuestionId = `${question.id}-${upperLevel}-${level}`
          let currentAnswer = filteredAnswers[`${completeQuestionId}_text`]
          if (question.id.includes('actions')) {
            currentAnswer = getActionsAnswerForUniversity(filteredAnswers, completeQuestionId)
          }

          if (!currentAnswer || currentAnswer.length < 1) {
            return null
          }
          if (answerLength > 1500) {
            answerLength = 0
          }
          if (question.id.includes('actions')) {
            const actionLength = currentAnswer.reduce((acc, { actions }) => acc + actions.length, 0)
            answerLength += actionLength
          } else {
            answerLength += currentAnswer.length
          }
          return (
            <div className={answerLength > 1500 ? 'page-break' : ''}>
              {showThemeTitle && (
                <h3
                  lang="fi"
                  style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {themeIndex + 1}. {theme.title[lang]} ({t(`overview:printingUpperLevelTitle:${upperLevel}`)})
                </h3>
              )}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'row' }}>
                <QuestionContainer
                  upperLevel={upperLevel}
                  level={level}
                  question={question}
                  currentAnswer={currentAnswer}
                  answerLength={answerLength}
                  questionLabelCorrectCase={questionLabelCorrectCase}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const QuestionContainer = ({ question, currentAnswer, questionLabelCorrectCase }) => {
  if (!currentAnswer || currentAnswer.length < 0) {
    return (
      <div style={{ height: '20em', border: '3px solid', width: '100%', padding: '2em', margin: '2em' }}>
        <p>Ei vastauksia</p>
      </div>
    )
  }
  if (question.id.includes('actions')) {
    return (
      <div style={{ border: '3px solid', padding: '2em', margin: '2em' }}>
        <h3>{questionLabelCorrectCase}</h3>
        {currentAnswer.map(({ title, actions }) => {
          return (
            <div key={`${title}-${actions}`}>
              {' '}
              <p style={{ fontWeight: 'bold', paddingTop: '1em' }}>{title} </p>
              <ReactMarkdown>{actions}</ReactMarkdown>{' '}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ border: '3px solid', padding: '2em', margin: '2em' }}>
      <h3>{questionLabelCorrectCase}</h3>
      <ReactMarkdown>{currentAnswer}</ReactMarkdown>
    </div>
  )
}

const CommitteePrinting = ({ type = null }) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser.data)
  const answers = useSelector(state => state.tempAnswers)
  const oldAnswers = useSelector(state => state.oldAnswers)
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()
  const componentRef = useRef()

  const hasRights = currentUser => isEvaluationUniversityUser(currentUser)

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang])

  useEffect(() => {
    if (hasRights(currentUser)) {
      dispatch(getAllTempAnswersAction())
    }
  }, [])

  if (answers.pending || !answers.data || !oldAnswers.data) {
    return <Loader active inline="centered" />
  }

  let answerLevel = []

  const answerLevels = [
    { title: 'university', levels: ['master', 'doctoral'] },
    { title: 'arviointi', levels: ['master', 'doctoral', 'overall'] },
  ]

  switch (type) {
    case 'uni-bachelor-master':
      answerLevel = [{ title: 'university', levels: ['master'] }]
      break
    case 'uni-doctoral':
      answerLevel = [{ title: 'university', levels: ['doctoral'] }]
      break
    case 'arviointi-bachelor-master':
      answerLevel = [{ title: 'arviointi', levels: ['master'] }]
      break
    case 'arviointi-doctoral':
      answerLevel = [{ title: 'arviointi', levels: ['doctoral'] }]
      break
    default:
      answerLevel = answerLevels
      break
  }

  return (
    <div ref={componentRef}>
      <div className="hide-in-print-mode">
        <PDFDownload componentRef={componentRef} />
      </div>
      <StudyLevelContainer answerLevels={answerLevel} />
    </div>
  )
}
//                 <p style={{ fontWeight: 'bold', wordWrap: 'break-word', width: '6em' }}>{theme.title[lang]}</p>

export default CommitteePrinting
