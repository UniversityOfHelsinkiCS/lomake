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
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  useEffect(() => {
    document.title = `${t('overview')}`
  }, [lang, t])

  useEffect(() => {
    dispatch(getTempAnswersByFormAndYear(form, year))
  }, [dispatch])

  const programmeByKey = key => programmes.find(prog => prog.key === key)

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
            <div>
              <h3>{question.label[lang]}</h3>
              <div>{t('actionProposals')}:</div>
              {question.actions.map(action => {
                return (
                  <div key={action.name[lang]}>
                    {action.number}: {action.name[lang]}
                  </div>
                )
              })}
            </div>
            <h3>{t('answers')}:</h3>
            {questionAnswers.length > 0 ? (
              questionAnswers.map(answer => (
                <div key={answer.programme} style={{ marginBottom: 25 }}>
                  <div style={{ margin: 10, fontSize: 14, fontWeight: 'bold' }}>
                    {answer.programme} {programmeByKey(answer.programme).name[lang]}
                  </div>
                  <div style={{ margin: 10, paddingLeft: 10 }}>{answer.data[`${question.id}_text`]}</div>
                </div>
              ))
            ) : (
              <div>{t('noAnswers')}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ProgrammeLevelAnswers
