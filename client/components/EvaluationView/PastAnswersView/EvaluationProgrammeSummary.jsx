/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router'
import { Accordion } from 'semantic-ui-react'
import sortBy from 'lodash/sortBy'

import { isAdmin } from '../../../../config/common'
import { getProgramme } from '../../../redux/studyProgrammesReducer'
import { getCurrentEvaluationFacultySummary } from '../../../redux/summaryReducer'
import { modifiedQuestions, answersByQuestions } from '../../../util/common'
import { formKeys } from '../../../../config/data'
import Question from '../../ComparisonPage/Question'

const getTotalWritten = ({ question, allAnswers }) => {
  if (allAnswers.length === 0) return []
  const answers = allAnswers.answers.get(question.id)
  const filteredAnswers = answers ? answers.filter(a => a.answer) : []
  const mapped = {
    year: allAnswers.year,
    answers: sortBy(filteredAnswers, 'name'),
  }
  return [mapped]
}

const ViewEvaluationAnswersForFaculty = () => {
  const { programme: programmeKey } = useParams()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  const filters = useSelector(state => state.filters)
  const [showingQuestion, setShowingQuestion] = useState(-1)

  const { pending, forProgramme } = useSelector(state => state.summaries)
  const allProgrammes = useSelector(state => state.studyProgrammes.data)
  const facultyProgrammes = Object.values(allProgrammes).filter(p => p.primaryFaculty.code === programmeKey)

  const readAccess = user.access[programmeKey]?.read ?? isAdmin(user)
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

    const selectedAnswers = forProgramme.filter(a => a.year === 2023)
    const result = {
      year: 2023,
      answers: answersByQuestions({
        chosenProgrammes: facultyProgrammes,
        selectedAnswers,
        questionsList,
        usersProgrammes: facultyProgrammes,
        lang,
        form: formKeys.EVALUATION_FACULTIES,
        t,
      }),
    }
    return result
  }, [forProgramme, pending, user, programmeKey])

  if (!programmeKey || !readAccess) return <Navigate to="/" />
  return (
    <>
      <h2>{facultyName}</h2>
      <h3>{t('formView:evaluationFacultyAnswers')}</h3>
      <Accordion className="comparison-container" fluid>
        {questionsList.map(question => (
          <Question
            answers={getTotalWritten({ question, allAnswers, chosenKeys: [programmeKey] })}
            chosenProgrammes={[programmeKey]}
            form="evaluation"
            handleClick={() => setShowingQuestion(showingQuestion === question.id ? -1 : question.id)}
            key={question.id}
            question={question}
            showing={showingQuestion === question.id}
          />
        ))}
      </Accordion>
    </>
  )
}

export default ViewEvaluationAnswersForFaculty
