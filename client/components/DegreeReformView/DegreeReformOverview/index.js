import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'

import { isAdmin } from '@root/config/common'
import useDebounce from 'Utilities/useDebounce'
import CustomModal from 'Components/Generic/CustomModal'
import NoPermissions from 'Components/Generic/NoPermissions'
import { getForm } from 'Utilities/common'
import ColorTable from '../../OverviewPage/ColorTable'
import StatsContent from '../../OverviewPage/StatsContent'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'

const getFacultyFromUrl = () => {
  const url = window.location.href
  const facStart = url.indexOf('faculty=')
  if (facStart === -1) {
    return undefined
  }
  let faculty = url.substring(facStart + 8)

  const facEnd = faculty.indexOf('&')
  if (facEnd !== -1) {
    faculty = faculty.substring(0, facEnd)
  }

  return faculty
}

export default () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const [showAllProgrammes, setShowAllProgrammes] = useState(false)
  const [faculty, setFaculty] = useState(null)

  const debouncedFilter = useDebounce(filter, 200)
  const currentUser = useSelector(({ currentUser }) => currentUser)
  const lang = useSelector(state => state.language)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const faculties = useSelector(({ faculties }) => faculties)

  useEffect(() => {
    const facultyFromUrl = getFacultyFromUrl()
    setFaculty(facultyFromUrl)
  }, [])

  useEffect(() => {
    document.title = `${t('degree-reform')}`
  }, [lang])

  const formType = 'degree-reform'

  const handleFilterChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const handleShowProgrammes = () => {
    setShowAllProgrammes(!showAllProgrammes)
  }

  const usersProgrammes = useMemo(() => {
    if (isAdmin(currentUser.data)) {
      return programmes
    }
    if (currentUser.data.access || currentUser.specialGroup) {
      const usersPermissionsKeys = Object.keys(currentUser.data.access)
      if (!showAllProgrammes) {
        return programmes.filter(program => usersPermissionsKeys.includes(program.key))
      }
      return programmes
    }
    return []
  }, [programmes, currentUser.data, showAllProgrammes])

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

  let facultyProgrammes = null

  if (faculty) {
    const facultyObject = faculties.data.find(f => f.code === faculty)
    const facultyProgrammeCodes = facultyObject.ownedProgrammes
      .map(p => p.key)
      .concat(facultyObject.companionStudyprogrammes.map(p => p.key))
      .sort()

    facultyProgrammes = programmes.filter(p => facultyProgrammeCodes.includes(p.key))
  }

  const nameOf = faculty => faculties.data.find(f => f.code === faculty).name[lang]

  return (
    <>
      {faculty && <h2 style={{ marginTop: 20 }}>{nameOf(faculty)}</h2>}
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
          <ProgramControlsContent programKey={programControlsToShow.key} form={getForm(formType)} />
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
            <h2 className="view-title">{t('degree-reform').toUpperCase()}</h2>
          </div>
          <div style={{ marginTop: '1em' }}>
            <ColorTable
              filteredProgrammes={facultyProgrammes || filteredProgrammes}
              setModalData={setModalData}
              setProgramControlsToShow={setProgramControlsToShow}
              setStatsToShow={setStatsToShow}
              isBeingFiltered={debouncedFilter !== ''}
              handleFilterChange={handleFilterChange}
              filterValue={filter}
              formType={formType}
              handleShowProgrammes={handleShowProgrammes}
              showAllProgrammes={showAllProgrammes}
              form={2}
            />
          </div>
        </>
      ) : (
        <NoPermissions t={t} />
      )}
    </>
  )
}
