import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useVisibleOverviewProgrammes } from '../../../util/overview'
import NoPermissions from '../../Generic/NoPermissions'
import { formKeys } from '../../../../config/data'
import { setLevel } from '../../../redux/filterReducer'
import MetaOverview from './MetaOverview'

const ProgrammeLevelOverview = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [showAllProgrammes, setShowAllProgrammes] = useState(false)
  const selectedLevel = useSelector(({ filters }) => filters.level)
  const currentUser = useSelector(({ currentUser }) => currentUser)
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const form = formKeys.META_EVALUATION
  const formType = 'meta-evaluation'

  const filterState = useMemo(() => {
    return a => {
      if (selectedLevel === 'bachelor') return a.level === 'bachelor'
      if (selectedLevel === 'master') return a.level === 'master'
      if (selectedLevel === 'doctoral') return a.level === 'doctoral'
      return a.level !== 'doctoral'
    }
  }, [selectedLevel])

  const usersProgrammes = useVisibleOverviewProgrammes({
    currentUser,
    programmes,
    showAllProgrammes,
  })

  const filteredProgrammes = usersProgrammes.filter(filterState)

  useEffect(() => {
    document.title = `${t('metaevaluation')}`
    if (filteredProgrammes.length === 0 && selectedLevel !== 'doctoral') {
      dispatch(setLevel('doctoral'))
    }
  }, [lang, t])

  const handleShowAllProgrammes = () => {
    setShowAllProgrammes(!showAllProgrammes)
  }

  return usersProgrammes.length > 0 ? (
    <MetaOverview
      t={t}
      lang={lang}
      dispatch={dispatch}
      faculties={faculties}
      programmes={filteredProgrammes}
      form={form}
      formType={formType}
      showAllProgrammes={showAllProgrammes}
      handleShowAllProgrammes={handleShowAllProgrammes}
    />
  ) : (
    <NoPermissions t={t} requestedForm={t('metaevaluation')} />
  )
}

export default ProgrammeLevelOverview
