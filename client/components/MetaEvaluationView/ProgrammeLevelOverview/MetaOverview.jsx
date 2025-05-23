import React, { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { Button, Dropdown, Menu, MenuItem, Loader } from 'semantic-ui-react'
import { filterFromUrl, filterUserProgrammes, kludge } from '../../../util/common'
import useDebounce from '../../../util/useDebounce'

import CsvDownload from '../../Generic/CsvDownload'
import CustomModal from '../../Generic/CustomModal'
import { basePath } from '../../../../config/common'
import ColorTable from '../../OverviewPage/ColorTable'
import StatsContent from '../../OverviewPage/StatsContent'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'
import FacultyDropdown from './FacultyDropdown'
import DegreeDropdown from './DegreeDropdown'
import YearSelector from '../../Generic/YearSelector'

const MetaOverview = ({
  t,
  lang,
  dispatch,
  faculties,
  programmes,
  form,
  formType,
  showAllProgrammes,
  handleShowAllProgrammes,
}) => {
  const [filter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)
  const [showCsv, setShowCsv] = useState(false)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const debouncedFilter = useDebounce(filter, 200)
  const titleText = `${t('metaevaluation').toUpperCase()}`

  useEffect(() => {
    const filterQuery = filterFromUrl()
    if (filterQuery) setFilter(filterQuery)
    document.title = t('metaevaluation')
  }, [dispatch, t, lang, programmes])

  const filteredProgrammes = useMemo(() => {
    return filterUserProgrammes(programmes, lang, debouncedFilter)
  }, [programmes, lang, debouncedFilter])
  
  const handleDropdownFilterChange = value => {
    window.history.pushState({}, '', `${basePath}meta-evaluation?filter=${value}`)
    setFilter(value)
  }

  const handleFilterChange = e => {
    window.history.pushState({}, '', `${basePath}meta-evaluation?filter=${e.target.value}`)
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
        <MenuItem header style={{ paddingLeft: 0 }}>
          <h2 style={{ maxWidth: '16em' }}>{titleText}</h2>
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
          <Button data-cy="nav-comparison" as={Link} to="/report?form=7" size="big">
            {t('overview:compareAnswers')}
          </Button>
        </MenuItem>
        <MenuItem>
          <YearSelector size="extra-small" />
        </MenuItem>
        <DegreeDropdown />
        <FacultyDropdown
          t={t}
          programmes={programmes}
          handleFilterChange={handleDropdownFilterChange}
          faculties={faculties}
          lang={lang}
          debouncedFilter={debouncedFilter}
        />
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
          handleShowProgrammes={handleShowAllProgrammes}
          meta
        />
      </div>
    </>
  )
}

export default MetaOverview
