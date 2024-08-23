import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useVisibleOverviewProgrammes } from 'Utilities/overview'
import NoPermissions from 'Components/Generic/NoPermissions'
import { formKeys } from '@root/config/data'
import { setDoctoral } from 'Utilities/redux/doctoralReducer'
import MetaOverview from './MetaOverview'

const ProgrammeLevelOverview = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [showAllProgrammes, setShowAllProgrammes] = useState(false)
  const currentUser = useSelector(({ currentUser }) => currentUser)
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const doctoral = useSelector(state => state.doctoral)
  const form = formKeys.META_EVALUATION
  const formType = 'meta-evaluation'

  const filterState = useMemo(() => (doctoral ? a => a.key.startsWith('T') : a => !a.key.startsWith('T')), [doctoral])

  const usersProgrammes = useVisibleOverviewProgrammes({
    currentUser,
    programmes,
    showAllProgrammes,
  })

  const filteredProgrammes = usersProgrammes.filter(filterState)

  useEffect(() => {
    document.title = `${t('metaevaluation')}`
    if (filteredProgrammes.length === 0) {
      dispatch(setDoctoral(!doctoral))
    }
  }, [lang, t])

  return usersProgrammes.length > 0 ? (
    <MetaOverview
      t={t}
      lang={lang}
      dispatch={dispatch}
      faculties={faculties}
      programmes={filteredProgrammes}
      form={form}
      formType={formType}
      doctoral={doctoral}
      setDoctoral={setDoctoral}
      showAllProgrammes={showAllProgrammes}
      setShowAllProgrammes={setShowAllProgrammes}
    />
  ) : (
    <NoPermissions t={t} requestedForm={t('metaevaluation')} />
  )
}

export default ProgrammeLevelOverview
