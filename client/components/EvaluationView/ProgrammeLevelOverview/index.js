import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'

import { filterFromUrl } from 'Utilities/common'
import { useVisibleOverviewProgrammes } from 'Utilities/overview'
import { isAdmin } from '@root/config/common'
import useDebounce from 'Utilities/useDebounce'
import CustomModal from 'Components/Generic/CustomModal'
import NoPermissions from 'Components/Generic/NoPermissions'
import ColorTable from '../../OverviewPage/ColorTable'
import StatsContent from '../../OverviewPage/StatsContent'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'

export default () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)

  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const [showAllProgrammes, setShowAllProgrammes] = useState(false)
  const debouncedFilter = useDebounce(filter, 200)
  const currentUser = useSelector(({ currentUser }) => currentUser)
  const lang = useSelector(state => state.language)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  const form = 4 // TO FIX
  const formType = 'evaluation'

  useEffect(() => {
    const filterQuery = filterFromUrl()
    if (filterQuery) {
      setFilter(filterQuery)
    }
  }, [])

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang])

  const handleFilterChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const handleShowProgrammes = () => {
    setShowAllProgrammes(!showAllProgrammes)
  }

  const usersProgrammes = useVisibleOverviewProgrammes(currentUser, programmes, showAllProgrammes)

  const filteredProgrammes = useMemo(() => {
    return usersProgrammes.filter(prog => {
      const name = prog.name[lang]
      const code = prog.key
      return (
        name.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        code.toLowerCase().includes(debouncedFilter.toLowerCase())
      )
    })
  }, [usersProgrammes, lang, debouncedFilter])

  const moreThanFiveProgrammes = useMemo(() => {
    if (isAdmin(currentUser.data)) return true
    if (currentUser.data.access && Object.keys(currentUser.data.access).length > 5) return true
    return false
  }, [currentUser])

  return (
    <>
      {modalData && (
        <CustomModal title={modalData.header} closeModal={() => setModalData(null)} borderColor={modalData.color}>
          <>
            <div style={{ paddingBottom: '1em' }}>{modalData.programme}</div>
            <div style={{ fontSize: '1.2em' }}>
              <ReactMarkdown>{modalData.content}</ReactMarkdown>
            </div>
          </>
        </CustomModal>
      )}

      {programControlsToShow && (
        <CustomModal
          title={`${t('overview:accessRights')} - ${
            programControlsToShow.name[lang] ? programControlsToShow.name[lang] : programControlsToShow.name.en
          }`}
          closeModal={() => setProgramControlsToShow(null)}
        >
          <ProgramControlsContent programKey={programControlsToShow.key} form={form} />
        </CustomModal>
      )}

      {statsToShow && (
        <CustomModal title={statsToShow.title} closeModal={() => setStatsToShow(null)}>
          <StatsContent stats={statsToShow.stats} />
        </CustomModal>
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <div className={moreThanFiveProgrammes ? 'wide-header' : 'wideish-header'}>
            <h2 className="view-title">{t('evaluation').toUpperCase()}</h2>
          </div>
          <div style={{ marginTop: '1em' }}>
            <ColorTable
              filteredProgrammes={filteredProgrammes}
              setModalData={setModalData}
              setProgramControlsToShow={setProgramControlsToShow}
              setStatsToShow={setStatsToShow}
              isBeingFiltered={debouncedFilter !== ''}
              handleFilterChange={handleFilterChange}
              filterValue={filter}
              form={form}
              formType={formType}
              showAllProgrammes={showAllProgrammes}
              handleShowProgrammes={handleShowProgrammes}
            />
          </div>
        </>
      ) : (
        <NoPermissions t={t} />
      )}
    </>
  )
}
