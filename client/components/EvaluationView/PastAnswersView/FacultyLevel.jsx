import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { Accordion, Divider } from 'semantic-ui-react'
import sortBy from 'lodash/sortBy'

import { isAdmin } from '../../../../config/common'
import { getProgramme } from '../../../util/redux/studyProgrammesReducer'
import { getOldYearlyFacultyAnswersAction } from '../../../util/redux/summaryReducer'
import { modifiedQuestions, answersByQuestions } from '../../../util/common'
import Question from '../../ComparisonPage/Question'

const getTotalWritten = ({ question, allAnswers }) => {
  const mapped = allAnswers.map(data => {
    const answers = data.answers.get(question.id)
    const filteredAnswers = answers ? answers.filter(a => a.answer) : []
    return {
      year: data.year,
      answers: sortBy(filteredAnswers, 'name'),
    }
  })
  return mapped
}

const PastAnswersViewFaculty = ({ programmeKey }) => {
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
      dispatch(getOldYearlyFacultyAnswersAction(programmeKey, lang))
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
          usersProgrammes: facultyProgrammes,
          chosenProgrammes: facultyProgrammes,
          selectedAnswers,
          questionsList,
          lang,
          t,
        }),
      }
      return data
    })

    return result
  }, [forProgramme, pending, user, programmeKey])

  if (!programmeKey || !readAccess) return <Redirect to="/" />
  let titleNumberLast = 0
  let titleNumberNew = 0

  const titleList = []
  questionsList.map(question => {
    titleNumberLast = titleNumberNew
    titleNumberNew = question.titleIndex
    if (titleNumberNew !== titleNumberLast) {
      titleList.push(question.title)
      return true
    }
    return false
  })

  return (
    <>
      <h2>{facultyName}</h2>
      <h3>{t('formView:yearlyFacultyAnswers')}</h3>
      <Accordion fluid className="comparison-container">
        {titleList.map(title => (
          <div key={`${title}`}>
            <Divider section />

            <h2>{title}</h2>
            {questionsList.map(question => {
              if (question.title !== title) return false
              return (
                <div key={question.id}>
                  <Question
                    answers={getTotalWritten({ question, allAnswers, chosenKeys: [programmeKey] })}
                    question={question}
                    chosenProgrammes={[programmeKey]}
                    showing={showingQuestion === question.id}
                    handleClick={() => setShowingQuestion(showingQuestion === question.id ? -1 : question.id)}
                    form="evaluation"
                  />
                </div>
              )
            })}
          </div>
        ))}
      </Accordion>
    </>
  )
}

export default PastAnswersViewFaculty
