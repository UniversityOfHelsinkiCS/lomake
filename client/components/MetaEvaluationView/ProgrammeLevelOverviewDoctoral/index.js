import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useVisibleOverviewProgrammes } from 'Utilities/overview'
import NoPermissions from 'Components/Generic/NoPermissions'
import { formKeys } from '@root/config/data'
import MetaOverview from '../ProgrammeLevelOverview/MetaOverview'

const ProgrammeLevelOverviewDoctoral = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const doctoral = true

  const [showAllProgrammes, setShowAllProgrammes] = useState(false)
  const currentUser = useSelector(({ currentUser }) => currentUser)
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const form = formKeys.META_EVALUATION
  const formType = 'meta-evaluation'
  const filterProgrammes = a => a.key.startsWith('T')

  const year = 2024

  const usersProgrammes = useVisibleOverviewProgrammes({
    currentUser,
    programmes,
    showAllProgrammes,
    year,
    form,
  }).filter(filterProgrammes)

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang])

  return (
    <div>
      {usersProgrammes.length > 0 ? (
        <MetaOverview
          t={t}
          lang={lang}
          currentUser={currentUser}
          dispatch={dispatch}
          faculties={faculties}
          programmes={usersProgrammes}
          year={year}
          form={form}
          formType={formType}
          doctoral={doctoral}
          showAllProgrammes={showAllProgrammes}
          setShowAllProgrammes={setShowAllProgrammes}
        />
      ) : (
        <NoPermissions t={t} />
      )}
    </div>
  )
}

export default ProgrammeLevelOverviewDoctoral
