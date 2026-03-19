/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Button, Menu, MenuItem } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import ReactMarkdown from 'react-markdown'
import { filterFromUrl } from '../../util/common'
import { useVisibleOverviewProgrammes } from '../../util/overview'
import { isAdmin } from '../../../config/common'
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

export default () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const [modalData, setModalData] = useState(null)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const [showCsv, setShowCsv] = useState(false)
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
        name.toLowerCase().includes(debouncedFilter.toLowerCase()) ??
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
      {modalData ? (
        <CustomModal borderColor={modalData.color} closeModal={() => setModalData(null)} title={modalData.header}>
          <>
            <div style={{ paddingBottom: '1em' }}>{modalData.programme}</div>
            <div style={{ fontSize: '1.2em' }}>
              <ReactMarkdown>{modalData.content}</ReactMarkdown>
            </div>
          </>
        </CustomModal>
      ) : null}

      {programControlsToShow ? (
        <CustomModal
          closeModal={() => setProgramControlsToShow(null)}
          title={`${t('overview:accessRights')} - ${programControlsToShow.name[lang] ?? programControlsToShow.name.en}`}
        >
          <ProgramControlsContent programKey={programControlsToShow.key} />
        </CustomModal>
      ) : null}

      {statsToShow ? (
        <CustomModal closeModal={() => setStatsToShow(null)} title={statsToShow.title}>
          <StatsContent stats={statsToShow.stats} />
        </CustomModal>
      ) : null}

      {usersProgrammes.length > 0 ? (
        <>
          <Menu className="filter-row" secondary size="large">
            <MenuItem>
              <h2>{t('yearlyAssessment').toUpperCase()}</h2>
            </MenuItem>
            <MenuItem>
              <Button as={Link} data-cy="nav-report" secondary size="big" to="/report">
                {t('overview:readAnswers')}
              </Button>
            </MenuItem>
            <MenuItem>
              {moreThanFiveProgrammes ? (
                <Button as={Link} data-cy="nav-comparison" size="big" to="/comparison">
                  {t('overview:compareAnswers')}
                </Button>
              ) : null}
            </MenuItem>
            <MenuItem>
              <YearSelector size="extra-small" />
            </MenuItem>
            <MenuItem position="right">
              <Dropdown
                className="button basic gray csv-download"
                data-cy="csv-download"
                direction="left"
                onClick={() => setShowCsv(true)}
                text={t('overview:csvDownload')}
              >
                {showCsv ? (
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <CsvDownload form={form} view="overview" wantedData="written" />
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <CsvDownload form={form} view="overview" wantedData="colors" />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                ) : null}
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
