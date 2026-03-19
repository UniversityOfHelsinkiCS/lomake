/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router'
import { Button, Dropdown, Menu, MenuItem } from 'semantic-ui-react'
import CsvDownload from '../../Generic/CsvDownload'
import { filterFromUrl } from '../../../util/common'
import { useVisibleOverviewProgrammes } from '../../../util/overview'
import YearSelector from '../../Generic/YearSelector'
import { isAdmin } from '../../../../config/common'
import useDebounce from '../../../util/useDebounce'
import CustomModal from '../../Generic/CustomModal'
import NoPermissions from '../../Generic/NoPermissions'
import { formKeys } from '../../../../config/data'
import ColorTable from '../../OverviewPage/ColorTable'
import StatsContent from '../../OverviewPage/StatsContent'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'

export default () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)
  const [showCsv, setShowCsv] = useState(false)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const [showAllProgrammes, setShowAllProgrammes] = useState(false)

  const debouncedFilter = useDebounce(filter, 200)
  const currentUser = useSelector(({ currentUser }) => currentUser)
  const lang = useSelector(state => state.language)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const form = formKeys.EVALUATION_PROGRAMMES
  const formType = 'evaluation'

  useEffect(() => {
    const filterQuery = filterFromUrl()
    if (filterQuery) {
      setFilter(filterQuery)
    }
  }, [])

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang])

  const handleFilterChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const handleShowProgrammes = () => {
    setShowAllProgrammes(!showAllProgrammes)
  }

  const usersProgrammes = useVisibleOverviewProgrammes({ currentUser, programmes, showAllProgrammes, form })

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
          <ProgramControlsContent form={form} programKey={programControlsToShow.key} />
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
            <MenuItem header>
              <h2>{t('evaluation').toUpperCase()}</h2>
            </MenuItem>
            <MenuItem>
              <Button as={Link} data-cy="nav-report" secondary size="big" to="/report?form=4">
                {t('overview:readAnswers')}
              </Button>
            </MenuItem>
            <MenuItem>
              {moreThanFiveProgrammes ? (
                <Button as={Link} data-cy="nav-comparison" size="big" to="/comparison?form=4">
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
        <NoPermissions requestedForm={t('evaluation')} t={t} />
      )}
    </>
  )
}
