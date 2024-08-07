import React, { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { Button, Dropdown, Menu, MenuItem, Loader } from 'semantic-ui-react'
import { filterFromUrl } from 'Utilities/common'
import useDebounce from 'Utilities/useDebounce'

import CsvDownload from 'Components/Generic/CsvDownload'
import CustomModal from 'Components/Generic/CustomModal'
import { useSelector } from 'react-redux'
import { setDoctoral } from 'Utilities/redux/doctoralReducer'
import ColorTable from '../../OverviewPage/ColorTable'
import StatsContent from '../../OverviewPage/StatsContent'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'
import FacultyDropdown from './FacultyDropdown'

const MetaOverview = ({
  t,
  lang,
  dispatch,
  faculties,
  programmes,
  form,
  formType,
  showAllProgrammes,
  setShowAllProgrammes,
}) => {
  const doctoral = useSelector(state => state.doctoral)
  const [filter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)
  const [showCsv, setShowCsv] = useState(false)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const [usersProgrammes, setUsersProgrammes] = useState([])
  const debouncedFilter = useDebounce(filter, 200)
  const titleText = `${t('metaevaluation').toUpperCase()}`
  const doctoralToggleText = doctoral ? t('doctoralToggle') : t('bachelorMasterToggle')

  useEffect(() => {
    const filterQuery = filterFromUrl()
    if (filterQuery) setFilter(filterQuery)
    document.title = t('metaevaluation')
    setUsersProgrammes(programmes)
  }, [dispatch, t, lang, programmes])

  const filteredProgrammes = useMemo(() => {
    return usersProgrammes.filter(
      prog =>
        prog.name[lang].toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        prog.primaryFaculty?.code?.toLowerCase().includes(debouncedFilter.toLowerCase()),
    )
  }, [usersProgrammes, lang, debouncedFilter])

  const handleDoctoralChange = () => {
    dispatch(setDoctoral(!doctoral))
  }

  const handleDropdownFilterChange = value => {
    window.history.pushState({}, '', `/meta-evaluation?filter=${value}`)
    setFilter(value)
  }

  const handleFilterChange = e => {
    window.history.pushState({}, '', `/meta-evaluation?filter=${e.target.value}`)
    setFilter(e.target.value)
  }

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

  if (programmes.length < 1) <Loader active />

  return (
    <>
      {renderModal()}
      <Menu size="large" className="filter-row" secondary>
        <MenuItem header>
          <h2>{titleText}</h2>
        </MenuItem>
        <MenuItem>
          <Button
            data-cy="nav-report"
            as={Link}
            to={filter ? `meta-evaluation/answers?filter=${filter}` : 'meta-evaluation/answers'}
            secondary
            size="big"
          >
            {t('overview:readAnswers')}
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            className="button basic gray"
            data-cy="doctle"
            onClick={() => handleDoctoralChange()}
            size="big"
            content={doctoralToggleText}
          />
        </MenuItem>
        <MenuItem>
          <FacultyDropdown
            t={t}
            programmes={programmes}
            handleFilterChange={handleDropdownFilterChange}
            faculties={faculties}
            lang={lang}
            debouncedFilter={debouncedFilter}
          />
        </MenuItem>
        <MenuItem position="right">
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
        </MenuItem>
      </Menu>
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
          meta
        />
      </div>
    </>
  )
}

export default MetaOverview
