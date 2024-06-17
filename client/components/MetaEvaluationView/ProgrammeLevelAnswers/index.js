import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { getTempAnswersByFormAndYear } from 'Utilities/redux/tempAnswersReducer'
import { Button } from 'semantic-ui-react'
import { metareviewQuestions as questionData } from '@root/client/questionData/index'

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

  if (!answers.data) return null

  return (
    <div>
      <div style={{ marginBottom: '2em' }}>
        <Button onClick={() => history.push('/meta-evaluation')} icon="arrow left" />
      </div>
      {questionData.map(question =>
        question.parts.map(part => {
          return (
            <div key={part.id} style={{ marginBottom: '2em' }}>
              <h2>
                {part.index}: {part.label[lang]}
              </h2>
            </div>
          )
        }),
      )}
    </div>
  )
}

export default ProgrammeLevelAnswers
