import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import ProgramControlsContent from './ProgramControlsContent'
import ColorTable from './ColorTable'
import StatsContent from './StatsContent'
import CsvDownload from 'Components/Generic/CsvDownload'
import CustomModal from 'Components/Generic/CustomModal'
import NoPermissions from 'Components/Generic/NoPermissions'
import YearSelector from 'Components/Generic/YearSelector'
import useDebounce from 'Utilities/useDebounce'
import { overviewPageTranslations as translations } from 'Utilities/translations'
import './OverviewPage.scss'

export default () => {
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const [modalData, setModalData] = useState(null)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const [showCsv, setShowCsv] = useState(false)

  const lang = useSelector((state) => state.language)
  const currentUser = useSelector((state) => state.currentUser)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  useEffect(() => {
    document.title = `${translations['overviewPage'][lang]}`
  }, [lang])

  const handleFilterChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const usersProgrammes = useMemo(() => {
    const usersPermissionsKeys = Object.keys(currentUser.data.access)
    return currentUser.data.hasWideReadAccess
      ? programmes
      : programmes.filter((program) => usersPermissionsKeys.includes(program.key))
  }, [programmes, currentUser.data])

  const filteredProgrammes = useMemo(() => {
    return usersProgrammes.filter((prog) => {
      const searchTarget = prog.name[lang]
      return searchTarget.toLowerCase().includes(debouncedFilter.toLowerCase())
    })
  }, [usersProgrammes, lang, debouncedFilter])

  const moreThanFiveProgrammes = useMemo(() => {
    if (currentUser.data.hasWideReadAccess) return true
    if (currentUser.data.access && Object.keys(currentUser.data.access).length > 5) return true
    return false
  }, [currentUser])

  return (
    <>
      {modalData && (
        <CustomModal
          title={modalData.header}
          closeModal={() => setModalData(null)}
          borderColor={modalData.color}
        >
          <>
            <div style={{ paddingBottom: '1em' }}>{modalData.programme}</div>
            <div style={{ fontSize: '1.2em' }}>
              <ReactMarkdown source={modalData.content} />
            </div>
          </>
        </CustomModal>
      )}

      {programControlsToShow && (
        <CustomModal
          title={`${translations.accessControl[lang]} - ${
            programControlsToShow.name[lang]
              ? programControlsToShow.name[lang]
              : programControlsToShow.name['en']
          }`}
          closeModal={() => setProgramControlsToShow(null)}
        >
          <ProgramControlsContent programKey={programControlsToShow.key} />
        </CustomModal>
      )}

      {statsToShow && (
        <CustomModal title={statsToShow.title} closeModal={() => setStatsToShow(null)}>
          <StatsContent stats={statsToShow.stats} />
        </CustomModal>
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <div className={moreThanFiveProgrammes ? "wide-header" : "wideish-header"}>
            <YearSelector size="extra-small" />
            <Button data-cy="nav-report" as={Link} to="/report" secondary size="big">
              {translations.readAnswersButton[lang]}
            </Button>
            {moreThanFiveProgrammes &&
              <Button data-cy="nav-comparison" as={Link} to="/comparison" size="big">
                {translations.compareAnswersButton[lang]}
              </Button>
            }
            <Dropdown
              data-cy="csv-download"
              className="button basic gray csv-download"
              direction="left"
              text={translations.csvDownload[lang]}
              onClick={() => setShowCsv(true)}
            >
              {showCsv ? (
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <CsvDownload wantedData="written" view="overview" />
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <CsvDownload wantedData="colors" view="overview" />
                  </Dropdown.Item>
                </Dropdown.Menu>
              ) : null}
            </Dropdown>
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
            />
          </div>
        </>
      ) : (
        <NoPermissions lang={lang} />
      )}
    </>
  )
}
