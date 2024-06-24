import { getTempAnswersByFormAndYear } from 'Utilities/redux/tempAnswersReducer'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Loader, Icon } from 'semantic-ui-react'
import { modifiedQuestions, answersByQuestions } from 'Utilities/common'
import WrittenAnswers from 'Components/ReportPage/WrittenAnswers'
import QuestionList from 'Components/Generic/QuestionList'

const ProgrammeLevelAnswers = () => {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const history = useHistory()
  const answers = useSelector(state => state.tempAnswers)
  const year = 2024
  const form = 7
  const programmes = useSelector(state => state.studyProgrammes)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const [showing, setShowing] = useState(-1)

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang, t])

  useEffect(() => {
    dispatch(getTempAnswersByFormAndYear(form, year))
  }, [dispatch])

  if (!answers.data || !programmes) return <Loader active />

  const questionsList = modifiedQuestions(lang, 7)

  const answersList =
    answers.data &&
    answersByQuestions({
      chosenProgrammes: usersProgrammes,
      selectedAnswers: answers.data,
      questionsList,
      usersProgrammes,
      lang,
      t,
      form,
    })

  return (
    <div>
      <div className="wide-header">
        <h1>{t('metaEvaluationAnswers').toUpperCase()}</h1>
        <Button onClick={() => history.push('/meta-evaluation')}>
          <Icon name="arrow left" />
          {t('backToFrontPage')}
        </Button>
      </div>
      <QuestionList label="" questionsList={questionsList} />
      <WrittenAnswers
        year={year}
        questionsList={questionsList}
        chosenProgrammes={usersProgrammes}
        usersProgrammes={usersProgrammes}
        allAnswers={answersList}
        showing={showing}
        setShowing={setShowing}
      />
    </div>
  )
}

export default ProgrammeLevelAnswers
