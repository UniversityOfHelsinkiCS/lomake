import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { Accordion } from 'semantic-ui-react'
import * as _ from 'lodash'

import { isAdmin } from '@root/config/common'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { modifiedQuestions, cleanText, getMeasuresAnswer, programmeNameByKey as programmeName } from 'Utilities/common'
import Question from '../../ComparisonPage/Question'
import questions from '../../../questions.json'

const getTotalWritten = ({ question, allAnswers, chosenKeys }) => {
  const mapped = allAnswers.map(data => {
    const answers = data.answers.get(question.id)
    const filteredAnswers = answers ? answers.filter(a => chosenKeys.includes(a.key) && a.answer) : []
    return {
      year: data.year,
      answers: _.sortBy(filteredAnswers, 'name'),
    }
  })
  return mapped
}

const answersByQuestions = ({ usersProgrammes, year, oldAnswers, questionsList, lang }) => {
  const answerMap = new Map()
  const chosenKeys = usersProgrammes.map(p => p.key)
  const selectedAnswers = oldAnswers.data.filter(a => a.year === year)

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

const PastAnswersView = ({ programmeKey }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  const [showingQuestion, setShowingQuestion] = useState(-1)

  const oldAnswers = useSelector(state => state.oldAnswers)
  const allProgrammes = useSelector(state => state.studyProgrammes.data)
  const programme = Object.values(allProgrammes).find(p => p.key === programmeKey)

  const readAccess = (user.access[programmeKey] && user.access[programmeKey].read) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('Katselmus')} - ${programmeKey}`
    dispatch(getProgramme(programmeKey))
  }, [lang, programmeKey])

  // To be removed
  if (!isAdmin(user)) return <Redirect to="/" />

  if (!programmeKey || !readAccess) return <Redirect to="/" />

  const questionsList = modifiedQuestions(questions, lang)

  const answersForYears = () => {
    const all = [2020, 2021, 2022].map(year => {
      const data = {
        year,
        answers: answersByQuestions({
          usersProgrammes: [programme],
          year,
          oldAnswers,
          questionsList,
          lang,
        }),
      }
      return data
    })
    return all
  }

  const allAnswers = answersForYears()

  return (
    <>
      <h2>{programme.name[lang]}</h2>
      <h3> Edeltävän kolmen vuosiseurannan vastaukset</h3>
      <Accordion fluid className="comparison-container">
        {questionsList.map(question => (
          <Question
            key={question.id}
            answers={getTotalWritten({ question, allAnswers, chosenKeys: [programmeKey] })}
            question={question}
            chosenProgrammes={[programmeKey]}
            showing={showingQuestion === question.id}
            handleClick={() => setShowingQuestion(showingQuestion === question.id ? -1 : question.id)}
            katselmus
          />
        ))}
      </Accordion>
    </>
  )
}

export default PastAnswersView
