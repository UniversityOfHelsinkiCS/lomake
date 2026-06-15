/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Button, Menu, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { filterFromUrl } from '../../util/common'
import { useVisibleOverviewProgrammes } from '../../util/overview'
import CsvDownload from '../Generic/CsvDownload'
import CustomModal from '../Generic/CustomModal'
import NoPermissions from '../Generic/NoPermissions'
import YearSelector from '../Generic/YearSelector'
import useDebounce from '../../util/useDebounce'
import { formKeys } from '../../../config/data'
import StatsContent from './StatsContent'
import ColorTable from './ColorTable'
import ProgramControlsContent from './ProgramControlsContent'
import './OverviewPage.scss'
import { Link } from '../Link'

export default () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const [modalData, setModalData] = useState(null)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const [csvMenuAnchorEl, setCsvMenuAnchorEl] = useState(null)
  const [showAllProgrammes, setShowAllProgrammes] = useState(false)

  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  const form = formKeys.YEARLY_ASSESSMENT
  const formType = 'yearlyAssessment'

  useEffect(() => {
    const filterQuery = filterFromUrl()
    if (filterQuery) {
      setFilter(filterQuery)
    }
  }, [])

  useEffect(() => {
    document.title = `${t('overview:overviewPage')}`
  }, [lang])

  const handleFilterChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const handleShowProgrammes = () => {
    setShowAllProgrammes(!showAllProgrammes)
  }

  const usersProgrammes = useVisibleOverviewProgrammes({ currentUser, programmes, showAllProgrammes })
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

  return (
    <>
      {modalData && (
        <CustomModal borderColor={modalData.color} closeModal={() => setModalData(null)} title={modalData.header}>
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
          closeModal={() => setProgramControlsToShow(null)}
          title={`${t('overview:accessRights')} - ${programControlsToShow.name[lang] || programControlsToShow.name.en}`}
        >
          <ProgramControlsContent programKey={programControlsToShow.key} />
        </CustomModal>
      )}

      {statsToShow && (
        <CustomModal closeModal={() => setStatsToShow(null)} title={statsToShow.title}>
          <StatsContent stats={statsToShow.stats} />
        </CustomModal>
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <div className="filter-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h2>{t('yearlyAssessment').toUpperCase()}</h2>
            </div>
            <div>
              <Button component={Link} data-cy="nav-report" size="large" to="/report" variant="outlined">
                {t('overview:readAnswers')}
              </Button>
            </div>
            <div>
              <YearSelector size="extra-small" />
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Button
                aria-controls={csvMenuAnchorEl ? 'csv-download-menu' : undefined}
                aria-haspopup="true"
                data-cy="csv-download"
                onClick={event => setCsvMenuAnchorEl(event.currentTarget)}
                variant="outlined"
              >
                {t('overview:csvDownload')}
              </Button>
              <Menu
                anchorEl={csvMenuAnchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                id="csv-download-menu"
                keepMounted
                onClose={() => setCsvMenuAnchorEl(null)}
                open={Boolean(csvMenuAnchorEl)}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => setCsvMenuAnchorEl(null)}>
                  <CsvDownload form={form} view="overview" wantedData="written" />
                </MenuItem>
                <MenuItem onClick={() => setCsvMenuAnchorEl(null)}>
                  <CsvDownload form={form} view="overview" wantedData="colors" />
                </MenuItem>
              </Menu>
            </div>
          </div>
          <div>
            <ColorTable
              filterValue={filter}
              filteredProgrammes={filteredProgrammes}
              form={form}
              formType={formType}
              handleFilterChange={handleFilterChange}
              handleShowProgrammes={handleShowProgrammes}
              isBeingFiltered={debouncedFilter !== ''}
              setModalData={setModalData}
              setProgramControlsToShow={setProgramControlsToShow}
              setStatsToShow={setStatsToShow}
              showAllProgrammes={showAllProgrammes}
            />
          </div>
        </>
      ) : (
        <>
          <NoPermissions requestedForm={t('overview:overviewPage')} t={t} />
          <div data-cy="no-permissions-message">
            <a href="https://opetushallinto.cs.helsinki.fi/tilannekuva/evaluation-university/">
              {t('overview:toKatselmus')}
            </a>
          </div>
        </>
      )}
    </>
  )
}
