import { getTempAnswersByFormAndYear } from 'Utilities/redux/tempAnswersReducer'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Loader, Icon } from 'semantic-ui-react'
import { modifiedQuestions, answersByQuestions } from 'Utilities/common'
import WrittenAnswers from 'Components/ReportPage/WrittenAnswers'
import { setQuestions } from 'Utilities/redux/filterReducer'
import FacultyDropdown from '../ProgrammeLevelOverview/FacultyDropdown'

const ProgrammeLevelAnswers = ({ doctoral = false }) => {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const history = useHistory()
  const answers = useSelector(state => state.tempAnswers)
  const year = 2024
  const form = 7
  const programmes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const [showing, setShowing] = useState(-1)
  const questionsList = modifiedQuestions(lang, 7)
  const faculties = useSelector(state => state.faculties)
  const [usersProgrammes, setUsersProgrammes] = useState(programmes)
  const filteredQuestions = doctoral
    ? questionsList.filter(a => a.id.includes('T'))
    : questionsList.filter(a => !a.id.includes('T'))

  const filteredProgrammes = doctoral
    ? usersProgrammes.filter(a => a.key.includes('T'))
    : usersProgrammes.filter(a => !a.key.includes('T'))

  const getLabel = question => {
    if (!question) return ''
    const index = question.labelIndex < 10 ? `0${question.labelIndex}` : question.labelIndex
    return `${index}${question.label}`
  }

  const questionLabels = filteredQuestions.map(q => getLabel(q))

  useEffect(() => {
    document.title = `${t('evaluation')}`
    dispatch(setQuestions({ selected: questionLabels, open: [] }))
    dispatch(getTempAnswersByFormAndYear(form, year))
  }, [lang, t, dispatch, doctoral, programmes])

  if (!answers.data || !programmes) return <Loader active />

  const answersList =
    answers.data &&
    answersByQuestions({
      chosenProgrammes: filteredProgrammes,
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
        <Button onClick={() => history.goBack()}>
          <Icon name="arrow left" />
          {t('backToFrontPage')}
        </Button>
        <FacultyDropdown
          t={t}
          programmes={programmes}
          setUsersProgrammes={setUsersProgrammes}
          doctoral={doctoral}
          faculties={faculties}
          lang={lang}
        />
      </div>
      <WrittenAnswers
        year={year}
        questionsList={questionsList}
        chosenProgrammes={filteredProgrammes}
        usersProgrammes={filteredProgrammes}
        allAnswers={answersList}
        showing={showing}
        setShowing={setShowing}
      />
    </div>
  )
}

export default ProgrammeLevelAnswers
