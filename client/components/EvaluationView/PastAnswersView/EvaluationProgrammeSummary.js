import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { Accordion } from 'semantic-ui-react'
import * as _ from 'lodash'

import { isAdmin } from '@root/config/common'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { getCurrentEvaluationFacultySummary } from 'Utilities/redux/summaryReducer'
import { modifiedQuestions, cleanText, getMeasuresAnswer, programmeNameByKey as programmeName } from 'Utilities/common'
import Question from '../../ComparisonPage/Question'

const getTotalWritten = ({ question, allAnswers }) => {
  if (allAnswers.length === 0) return []
  const answers = allAnswers.answers.get(question.id)
  const filteredAnswers = answers ? answers.filter(a => a.answer) : []
  const mapped = {
    year: allAnswers.year,
    answers: _.sortBy(filteredAnswers, 'name'),
  }
  return [mapped]
}

const answersByQuestions = ({ usersProgrammes, year, oldAnswers, questionsList, lang }) => {
  if (!oldAnswers) {
    return {}
  }
  const answerMap = new Map()
  const chosenKeys = usersProgrammes.map(p => p.key)
  const selectedAnswers = oldAnswers.filter(a => a.year === year)
  if (!selectedAnswers) return new Map()
  selectedAnswers.forEach(programme => {
    const key = programme.programme
    if (chosenKeys.includes(key)) {
      const { data } = programme
      questionsList.forEach(question => {
        let colorsByProgramme = answerMap.get(question.id) ? answerMap.get(question.id) : []
        const color = data[question.color] ? data[question.color] : 'emptyAnswer'
        const name = programmeName(usersProgrammes, programme, lang)
        let answer = ''
        if (question.id.startsWith('measures')) answer = getMeasuresAnswer(data, question.id)
        else if (!question.id.startsWith('meta')) answer = cleanText(data[question.id])

        colorsByProgramme = [...colorsByProgramme, { name, key, color, answer }]
        answerMap.set(question.id, colorsByProgramme)
      })
    }
  })

  // if the programme has not yet been answered at all, it won't appear in the selectedAnswers.
  // So empty answers need to be added.
  answerMap.forEach((value, key) => {
    const answeredProgrammes = value.map(p => p.key)
    const programmesMissing = usersProgrammes.filter(p => !answeredProgrammes.includes(p.key))
    if (programmesMissing) {
      programmesMissing.forEach(p => {
        const earlierAnswers = answerMap.get(key)
        answerMap.set(key, [...earlierAnswers, { name: p.name[lang], key: p.key, color: 'emptyAnswer' }])
      })
    }
  })
  return answerMap
}

const ViewEvaluationAnswersForFaculty = ({ programmeKey }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  const filters = useSelector(state => state.filters)
  const [showingQuestion, setShowingQuestion] = useState(-1)

  const { pending, forProgramme } = useSelector(state => state.summaries)
  const allProgrammes = useSelector(state => state.studyProgrammes.data)
  const facultyProgrammes = Object.values(allProgrammes).filter(p => p.primaryFaculty.code === programmeKey)

  const readAccess = (user.access[programmeKey] && user.access[programmeKey].read) || isAdmin(user)
  const questionsList = modifiedQuestions(lang, filters.form)

  const facultyName = facultyProgrammes[0].primaryFaculty.name[lang]
  useEffect(() => {
    document.title = `${t('common:evaluation')} - ${programmeKey}`
    dispatch(getProgramme(programmeKey))
  }, [lang, programmeKey])

  useEffect(() => {
    if (!forProgramme || !pending) {
      dispatch(getCurrentEvaluationFacultySummary(programmeKey, lang))
    }
  }, [programmeKey])
  const allAnswers = useMemo(() => {
    if (pending || !forProgramme || forProgramme.length === 0) {
      return []
    }

    const result = {
      year: 2023,
      answers: answersByQuestions({
        usersProgrammes: facultyProgrammes,
        year: 2023,
        oldAnswers: forProgramme,
        questionsList,
        lang,
      }),
    }
    return result
  }, [forProgramme, pending, user, programmeKey])

  if (!programmeKey || !readAccess) return <Redirect to="/" />
  return (
    <>
      <h2>{facultyName}</h2>
      <h3>{t('formView:evaluationFacultyAnswers')}</h3>
      <Accordion fluid className="comparison-container">
        {questionsList.map(question => (
          <Question
            key={question.id}
            answers={getTotalWritten({ question, allAnswers, chosenKeys: [programmeKey] })}
            question={question}
            chosenProgrammes={[programmeKey]}
            showing={showingQuestion === question.id}
            handleClick={() => setShowingQuestion(showingQuestion === question.id ? -1 : question.id)}
            form="evaluation"
          />
        ))}
      </Accordion>
    </>
  )
}

export default ViewEvaluationAnswersForFaculty
