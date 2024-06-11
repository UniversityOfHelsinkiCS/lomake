import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { getTempAnswersByFormAndYear } from 'Utilities/redux/tempAnswersReducer'
import { Button } from 'semantic-ui-react'
import { metareviewQuestions as questions } from '@root/client/questionData/index'

const ProgrammeLevelAnswers = () => {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const history = useHistory()
  const answers = useSelector(state => state.tempAnswers)
  const year = 2024
  const form = 7

  useEffect(() => {
    document.title = `${t('overview')}`
  }, [lang, t])

  useEffect(() => {
    dispatch(getTempAnswersByFormAndYear(form, year))
  }, [dispatch])

  return (
    <div>
      <div style={{ marginBottom: '2em' }}>
        <Button onClick={() => history.push('/meta-evaluation')} icon="arrow left" />
      </div>
      {questions.map(question => {
        const questionAnswers = answers.data
          ? answers.data.filter(answer => answer.data[`${question.id}_text`] !== undefined)
          : []
        return (
          <div key={question.id} style={{ marginBottom: '1em' }}>
            <div>{question.label[lang]}</div>
            {questionAnswers.length > 0 ? (
              questionAnswers.map(answer => (
                <div key={answer.programme}>
                  {answer.programme}: {answer.data[`${question.id}_text`]}
                </div>
              ))
            ) : (
              <div>No answers available</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ProgrammeLevelAnswers
