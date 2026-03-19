import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router'
import { Button, Dropdown, Menu, MenuItem, Loader } from 'semantic-ui-react'
import { filterFromUrl, filterUserProgrammes } from '../../../util/common'
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
        <CustomModal borderColor={modalData.color} closeModal={() => setModalData(null)} title={modalData.header}>
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
          closeModal={() => setProgramControlsToShow(null)}
          title={`${t('overview:accessRights')} - ${programControlsToShow.name[lang]}`}
        >
          <ProgramControlsContent form={form} programKey={programControlsToShow.key} />
        </CustomModal>
      )
    }
    if (statsToShow) {
      return (
        <CustomModal closeModal={() => setStatsToShow(null)} title={statsToShow.title}>
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
      <Menu className="filter-row" secondary size="large">
        <MenuItem header style={{ paddingLeft: 0 }}>
          <h2 style={{ maxWidth: '16em' }}>{titleText}</h2>
        </MenuItem>
        <MenuItem>
          <Button
            as={Link}
            data-cy="nav-report"
            secondary
            size="big"
            to={filter ? `meta-evaluation/answers?filter=${filter}` : 'meta-evaluation/answers'}
          >
            {t('overview:readAnswers')}
          </Button>
        </MenuItem>
        <MenuItem>
          <Button as={Link} data-cy="nav-comparison" size="big" to="/report?form=7">
            {t('overview:compareAnswers')}
          </Button>
        </MenuItem>
        <MenuItem>
          <YearSelector size="extra-small" />
        </MenuItem>
        <DegreeDropdown />
        <FacultyDropdown
          debouncedFilter={debouncedFilter}
          faculties={faculties}
          handleFilterChange={handleDropdownFilterChange}
          lang={lang}
          programmes={programmes}
          t={t}
        />
        <MenuItem position="right">
          <Dropdown
            className="button basic gray csv-download"
            data-cy="csv-download"
            direction="left"
            onClick={() => setShowCsv(!showCsv)}
            text={t('overview:csvDownload')}
          >
            <Dropdown.Menu>
              <Dropdown.Item>
                <CsvDownload form={form} view="overview" wantedData="written" />
              </Dropdown.Item>
              <Dropdown.Item>
                <CsvDownload form={form} view="overview" wantedData="colors" />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </MenuItem>
      </Menu>
      <div>
        <ColorTable
          filterValue={filter}
          filteredProgrammes={filteredProgrammes}
          form={form}
          formType={formType}
          handleFilterChange={handleFilterChange}
          handleShowProgrammes={handleShowAllProgrammes}
          isBeingFiltered={debouncedFilter !== ''}
          meta
          setModalData={setModalData}
          setProgramControlsToShow={setProgramControlsToShow}
          setStatsToShow={setStatsToShow}
          showAllProgrammes={showAllProgrammes}
        />
      </div>
    </>
  )
}

export default MetaOverview
