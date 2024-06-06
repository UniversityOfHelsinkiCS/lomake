import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useVisibleOverviewProgrammes } from 'Utilities/overview'

import { metareviewQuestions as questions } from '@root/client/questionData/index'
import MetaTable from './MetaTable'

const ProgrammeLevelOverview = () => {
  const { t } = useTranslation()
  const showAllProgrammes = false
  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  useEffect(() => {
    document.title = `${t('overview')}`
  }, [lang])

  const usersProgrammes = useVisibleOverviewProgrammes({ currentUser, programmes, showAllProgrammes })

  return (
    <div>
      <h1>Programme Level Overview</h1>
      <MetaTable programmes={usersProgrammes} questions={questions} />
    </div>
  )
}

export default ProgrammeLevelOverview
