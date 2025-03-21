import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Button, Menu, MenuItem } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
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
          <Menu size="large" className="filter-row" secondary>
            <MenuItem>
              <h2>{t('yearlyAssessment').toUpperCase()}</h2>
            </MenuItem>
            <MenuItem>
              <Button data-cy="nav-report" as={Link} to="/report" secondary size="big">
                {t('overview:readAnswers')}
              </Button>
            </MenuItem>
            <MenuItem>
              {moreThanFiveProgrammes && (
                <Button data-cy="nav-comparison" as={Link} to="/comparison" size="big">
                  {t('overview:compareAnswers')}
                </Button>
              )}
            </MenuItem>
            <MenuItem>
              <YearSelector size="extra-small" />
            </MenuItem>
            <MenuItem position="right">
              <Dropdown
                data-cy="csv-download"
                className="button basic gray csv-download"
                direction="left"
                text={t('overview:csvDownload')}
                onClick={() => setShowCsv(true)}
              >
                {showCsv ? (
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <CsvDownload wantedData="written" view="overview" form={form} />
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <CsvDownload wantedData="colors" view="overview" form={form} />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                ) : null}
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
              handleShowProgrammes={handleShowProgrammes}
              showAllProgrammes={showAllProgrammes}
            />
          </div>
        </>
      ) : (
        <>
          {false && <NoPermissions t={t} requestedForm={t('overview:overviewPage')} />}
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
