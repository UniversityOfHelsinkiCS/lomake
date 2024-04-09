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

const StudyLevelContainer = () => {
  const answerLevels = [
    { title: 'university', levels: ['master', 'doctoral'] },
    { title: 'arviointi', levels: ['master', 'doctoral', 'overall'] },
  ]
  return answerLevels.map(upperLevel => {
    return upperLevel.levels.map(level => {
      return questions.map(theme => {
        return <ThemeContainer upperLevel={upperLevel.title} level={level} theme={theme} />
      })
    })
  })
}

const ThemeContainer = ({ upperLevel, theme, level }) => {
  const lang = useSelector(state => state.language)

  return (
    <div style={{ display: 'flex', flexDirection: 'row', margin: '1em' }}>
      <div className="uni-print-theme-parts">
        {theme.parts.map(question => {
          if (question.id === 'meta2') {
            return null
          }
          const questionLabel = question.shortLabel ? question.shortLabel[lang] : question.label[lang]
          return (
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'row' }}>
              <div style={{ position: 'relative', marginBottom: '4em' }}>
                <p style={{ fontWeight: 'bold', wordWrap: 'break-word', width: '6em' }}>{theme.title[lang]}</p>
                <p style={{ wordWrap: 'break-word', width: '6em' }}>{questionLabel}</p>
              </div>
              <QuestionContainer upperLevel={upperLevel} level={level} question={question} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const QuestionContainer = ({ question, level, upperLevel }) => {
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const answers = useSelector(state => state.tempAnswers)
  const oldAnswers = useSelector(state => state.oldAnswers)
  const year = getYearToShow({ draftYear, nextDeadline, form: formKeys.EVALUATION_COMMTTEES })
  const { t } = useTranslation()

  const selectedAnswers = answersByYear({
    year,
    tempAnswers: answers,
    oldAnswers,
    draftYear: draftYear && draftYear.year,
    deadline: nextDeadline?.find(d => d.form === formKeys.EVALUATION_COMMTTEES),
    form: formKeys.EVALUATION_COMMTTEES,
  })

  let filteredAnswers = selectedAnswers && selectedAnswers.find(a => a.programme === 'UNI')
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
        <h3>{t(`overview:selectedLevels:${level}`)}</h3>
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
      <h3>{t(`overview:selectedLevels:${level}`)}</h3>
      <ReactMarkdown>{currentAnswer}</ReactMarkdown>
    </div>
  )
}

const CommitteePrinting = () => {
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

  return (
    <div ref={componentRef}>
      <PDFDownload componentRef={componentRef} />
      <StudyLevelContainer />
    </div>
  )
}

export default CommitteePrinting
