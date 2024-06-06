import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useVisibleOverviewProgrammes } from 'Utilities/overview'
import { getTempAnswersByFormAndYear } from 'Utilities/redux/tempAnswersReducer'
import { Loader } from 'semantic-ui-react'

import { metareviewQuestions as questions } from '@root/client/questionData/index'
import MetaTable from './MetaTable'

const form = 7

const ProgrammeLevelOverview = () => {
  const { t } = useTranslation()
  const showAllProgrammes = false
  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const dispatch = useDispatch()
  const answers = useSelector(state => state.tempAnswers)

  useEffect(() => {
    document.title = `${t('overview')}`
  }, [lang])

  useEffect(() => {
    dispatch(getTempAnswersByFormAndYear(form, 2024))
  }, [dispatch])

  const usersProgrammes = useVisibleOverviewProgrammes({ currentUser, programmes, showAllProgrammes })

  if (answers.pending || !answers.data) {
    return <Loader active inline="centered" />
  }

  return (
    <div>
      <h1>Programme Level Overview</h1>
      <MetaTable programmes={usersProgrammes} questions={questions} answers={answers} />
    </div>
  )
}

export default ProgrammeLevelOverview
