import { metareviewQuestions as questionData } from '@root/client/questionData/index'
import WrittenAnswers from 'Components/ReportPage/WrittenAnswers'
import { modifiedQuestions, answersByQuestions } from 'Utilities/common'
import { getTempAnswersByFormAndYear } from 'Utilities/redux/tempAnswersReducer'
import React, { useEffect, useState } from 'react'
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
  const programmes = useSelector(state => state.studyProgrammes)
  const { usersProgrammes } = programmes
  const [showing, setShowing] = useState(-1)

  const appendix = '_text'

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang, t])

  useEffect(() => {
    dispatch(getTempAnswersByFormAndYear(form, year))
  }, [dispatch])

  const questionsList = modifiedQuestions(lang, form)

  if (!answers.data || !programmes) return null

  return (
    <div>
      <div key="back-button" style={{ marginBottom: '2em' }}>
        <Button onClick={() => history.push('/meta-evaluation')} icon="arrow left" />
      </div>
      <WrittenAnswers
        year={year}
        usersProgrammes={programmes}
        chosenProgrammes={programmes}
        allAnswers={answersByQuestions({
          programmes,
          answers,
          questionsList,
          usersProgrammes,
          lang,
          t,
          form,
        })}
        questionsList={questionsList}
        showing={showing}
        setShowing={setShowing}
      />
      {questionData.map(question =>
        question.parts.map(action => {
          const programAnswers = answers.data
            ? answers.data.filter(answer => answer.data && answer.data[`${action.id}${appendix}`])
            : null
          return (
            <>
              <h3 key={action.id}>
                {action.index}: {action.label[lang]}
              </h3>
              {programAnswers &&
                programAnswers.map(answer => (
                  <div key={answer.created_at}>
                    {answer.programme}: {answer.data[`${action.id}${appendix}`]}
                  </div>
                ))}
            </>
          )
        }),
      )}
    </div>
  )
}

export default ProgrammeLevelAnswers
