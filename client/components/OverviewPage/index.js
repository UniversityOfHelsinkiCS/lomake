import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import ProgramControlsContent from './ProgramControlsContent'
import SmileyTable from './SmileyTable'
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

  const languageCode = useSelector((state) => state.language)
  const currentUser = useSelector((state) => state.currentUser)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  useEffect(() => {
    document.title = `${translations['overviewPage'][languageCode]}`
  }, [languageCode])

  const handleFilterChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const usersProgrammes = useMemo(() => {
    const usersPermissionsKeys = Object.keys(currentUser.data.access)
    return currentUser.data.admin
      ? programmes
      : programmes.filter((program) => usersPermissionsKeys.includes(program.key))
  }, [programmes, currentUser.data])

  const filteredProgrammes = useMemo(() => {
    return usersProgrammes.filter((prog) => {
      const searchTarget = prog.name[languageCode] || prog.name['en']
      return searchTarget.toLowerCase().includes(debouncedFilter.toLowerCase())
    })
  }, [usersProgrammes, languageCode, debouncedFilter])

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
          title={`${translations.accessControl[languageCode]} - ${
            programControlsToShow.name[languageCode]
              ? programControlsToShow.name[languageCode]
              : programControlsToShow.name['en']
          }`}
          closeModal={() => setProgramControlsToShow(null)}
        >
          <ProgramControlsContent programKey={programControlsToShow.key} />
        </CustomModal>
      )}

      {statsToShow && (
        <CustomModal title={statsToShow.title} closeModal={() => setStatsToShow(null)}>
          <StatsContent
            stats={statsToShow.stats}
            answers={statsToShow.answers}
            questionId={statsToShow.questionId}
          />
        </CustomModal>
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <div className="wide-header">
            <YearSelector />
            <Button data-cy="nav-report" as={Link} to="/report" secondary size="big">
              {translations.readAnswersButton[languageCode]}
            </Button>
            <Button data-cy="nav-comparison" as={Link} to="/comparison" size="big">
              {translations.compareAnswersButton[languageCode]}
            </Button>
            <Dropdown
              className="button basic gray"
              direction="left"
              text={translations.csvDownload[languageCode]}
              onClick={() => setShowCsv(true)}
            >
              {showCsv ? (
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <CsvDownload wantedData="written" view="overview" />
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <CsvDownload wantedData="smileys" view="overview" />
                  </Dropdown.Item>
                </Dropdown.Menu>
              ) : null}
            </Dropdown>
          </div>
          <div style={{ marginTop: '1em' }}>
            <SmileyTable
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
        <NoPermissions languageCode={languageCode} />
      )}
    </>
  )
}
