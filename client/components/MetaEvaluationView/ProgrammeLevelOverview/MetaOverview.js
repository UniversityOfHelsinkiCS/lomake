import React, { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { Button, Dropdown } from 'semantic-ui-react'
import { isAdmin } from '@root/config/common'
import { filterFromUrl } from 'Utilities/common'
import useDebounce from 'Utilities/useDebounce'

import CsvDownload from 'Components/Generic/CsvDownload'
import CustomModal from 'Components/Generic/CustomModal'
import ColorTable from '../../OverviewPage/ColorTable'
import StatsContent from '../../OverviewPage/StatsContent'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'
import FacultyDropdown from './FacultyDropdown'

const MetaOverview = ({
  t,
  lang,
  dispatch,
  currentUser,
  faculties,
  programmes,
  form,
  formType,
  doctoral,
  setDoctoral,
  showAllProgrammes,
  setShowAllProgrammes,
}) => {
  const [filter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)
  const [showCsv, setShowCsv] = useState(false)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const [usersProgrammes, setUsersProgrammes] = useState([])
  const debouncedFilter = useDebounce(filter, 200)
  const linkToAnwers = doctoral ? '/meta-evaluation/doctor/answers' : '/meta-evaluation/answers'
  const titleText = `${t('metaevaluation').toUpperCase()}`
  const doctoralToggleText = doctoral ? t('doctoralToggle') : t('bachelorMasterToggle')

  useEffect(() => {
    const filterQuery = filterFromUrl()
    if (filterQuery) setFilter(filterQuery)
    document.title = t('evaluation')
    setUsersProgrammes(programmes)
  }, [dispatch, t, lang, programmes])

  const filteredProgrammes = useMemo(() => {
    return usersProgrammes.filter(
      prog =>
        prog.name[lang].toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        prog.key.toLowerCase().includes(debouncedFilter.toLowerCase()),
    )
  }, [usersProgrammes, lang, debouncedFilter])

  const moreThanFiveProgrammes = useMemo(
    () => isAdmin(currentUser.data) || (currentUser.data.access && Object.keys(currentUser.data.access).length > 5),
    [currentUser],
  )

  const handleDoctoralChange = () => {
    dispatch(setDoctoral(!doctoral))
  }

  const handleFilterChange = e => setFilter(e.target.value)

  const renderModal = () => {
    if (modalData) {
      return (
        <CustomModal title={modalData.header} closeModal={() => setModalData(null)} borderColor={modalData.color}>
          <div style={{ paddingBottom: '1em' }}>{modalData.programme}</div>
          <div style={{ fontSize: '1.2em' }}>
            <ReactMarkdown>{modalData.content}</ReactMarkdown>
          </div>
        </CustomModal>
      )
    }
    if (programControlsToShow) {
      return (
        <CustomModal
          title={`${t('overview:accessRights')} - ${programControlsToShow.name[lang]}`}
          closeModal={() => setProgramControlsToShow(null)}
        >
          <ProgramControlsContent programKey={programControlsToShow.key} form={form} />
        </CustomModal>
      )
    }
    if (statsToShow) {
      return (
        <CustomModal title={statsToShow.title} closeModal={() => setStatsToShow(null)}>
          <StatsContent stats={statsToShow.stats} />
        </CustomModal>
      )
    }
    return null
  }

  return (
    <>
      {renderModal()}
      <div className={moreThanFiveProgrammes ? 'wide-header' : 'wideish-header'}>
        <h2 className="view-title">{titleText}</h2>
        <Button
          data-cy="doctle"
          onClick={() => handleDoctoralChange()}
          icon="filter"
          labelPosition="right"
          size="big"
          content={doctoralToggleText}
        />
        <Button data-cy="nav-report" as={Link} to={linkToAnwers} secondary size="big">
          {t('overview:readAnswers')}
        </Button>
        <FacultyDropdown
          t={t}
          programmes={programmes}
          setUsersProgrammes={setUsersProgrammes}
          doctoral={doctoral}
          faculties={faculties}
          lang={lang}
        />
        <Dropdown
          data-cy="csv-download"
          className="button basic gray csv-download"
          direction="left"
          text={t('overview:csvDownload')}
          onClick={() => setShowCsv(!showCsv)}
        >
          <Dropdown.Menu>
            <Dropdown.Item>
              <CsvDownload wantedData="written" view="overview" form={form} />
            </Dropdown.Item>
            <Dropdown.Item>
              <CsvDownload wantedData="colors" view="overview" form={form} />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div>
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
          handleShowProgrammes={() => setShowAllProgrammes(!showAllProgrammes)}
          doctoral={doctoral}
          meta
        />
      </div>
    </>
  )
}

export default MetaOverview
