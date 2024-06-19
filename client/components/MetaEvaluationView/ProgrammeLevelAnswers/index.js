import * as answer from '@models/answer'
import { metareviewQuestions as questionData } from '@root/client/questionData/index'
import { getTempAnswersByFormAndYear } from 'Utilities/redux/tempAnswersReducer'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const ProgrammeLevelAnswers = () => {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const history = useHistory()
  const answers = useSelector(state => state.tempAnswers)
  const year = 2024
  const form = 7

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang, t])

  useEffect(() => {
    dispatch(getTempAnswersByFormAndYear(form, year))
  }, [dispatch])

  if (!answers.data || !lang) return null

  return (
    <div>
      <div style={{ marginBottom: '2em' }}>
        <Button onClick={() => history.push('/meta-evaluation')} icon="arrow left" />
      </div>

      {questionData.map(question => question.parts.map(action => {
        const programAnswers = answers.data ? answers.data.find(answer => answer.data[`${action.id}_text`] !== undefined) : null
        console.log(programAnswers)
        return (
          <div>
            {action.label[lang]}
            {programAnswers && (
              <>
                <div>{programAnswers.programme}</div>
                <div>{programAnswers.data[`${action.id}_text`]}</div>
              </>
            )}
          </div>
        )
      }
      ))}
    </div >
  )
}

export default ProgrammeLevelAnswers
