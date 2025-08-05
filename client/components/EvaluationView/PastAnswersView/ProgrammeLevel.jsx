import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { Accordion } from 'semantic-ui-react'
import sortBy from 'lodash/sortBy'

import { isAdmin } from '../../../../config/common'
import { getProgramme } from '../../../redux/studyProgrammesReducer'
import { getProgrammeOldAnswersAction } from '../../../redux/summaryReducer'
import { modifiedQuestions, answersByQuestions } from '../../../util/common'
import Question from '../../ComparisonPage/Question'
import { useGetAuthUserQuery } from '@/client/redux/auth'

const getTotalWritten = ({ question, allAnswers, chosenKeys }) => {
  const mapped = allAnswers.map(data => {
    const answers = data.answers.get(question.id)
    const filteredAnswers = answers ? answers.filter(a => chosenKeys.includes(a.key) && a.answer) : []
    return {
      year: data.year,
      answers: sortBy(filteredAnswers, 'name'),
    }
  })
  return mapped
}

const PastAnswersView = ({ programmeKey }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useGetAuthUserQuery()
  const filters = useSelector(state => state.filters)
  const [showingQuestion, setShowingQuestion] = useState(-1)

  const { pending, forProgramme } = useSelector(state => state.summaries)
  const allProgrammes = useSelector(state => state.studyProgrammes.data)
  const programme = Object.values(allProgrammes).find(p => p.key === programmeKey)

  const readAccess = (user.access[programmeKey] && user.access[programmeKey].read) || isAdmin(user)
  const questionsList = modifiedQuestions(lang, filters.form)

  useEffect(() => {
    document.title = `${t('common:evaluation')} - ${programmeKey}`
    dispatch(getProgramme(programmeKey))
  }, [lang, programmeKey])

  useEffect(() => {
    if (!forProgramme || !pending) {
      dispatch(getProgrammeOldAnswersAction(programmeKey))
    }
  }, [programmeKey])

  const allAnswers = useMemo(() => {
    if (pending || !forProgramme || forProgramme.length === 0) {
      return []
    }

    const result = [2019, 2020, 2021, 2022, 2023].map(year => {
      const selectedAnswers = forProgramme.filter(a => a.year === year)
      const data = {
        year,
        answers: answersByQuestions({
          usersProgrammes: [programme],
          selectedAnswers,
          questionsList,
          chosenProgrammes: [programme],
          lang,
          t,
          form: filters.form,
        }),
      }
      return data
    })

    return result
  }, [forProgramme, pending, user, programmeKey])

  if (!programmeKey || !readAccess) return <Redirect to="/" />

  return (
    <>
      <h2>{programme.name[lang]}</h2>
      <h3>{t('formView:yearlyAnswers')}</h3>
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

export default PastAnswersView
