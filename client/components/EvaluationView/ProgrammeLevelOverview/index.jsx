import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'

import CsvDownload from '../../Generic/CsvDownload'
import { Button, Dropdown, Menu, MenuItem } from 'semantic-ui-react'
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
          <ProgramControlsContent programKey={programControlsToShow.key} form={form} />
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
            <MenuItem header>
              <h2>{t('evaluation').toUpperCase()}</h2>
            </MenuItem>
            <MenuItem>
              <Button data-cy="nav-report" as={Link} to="/report?form=4" secondary size="big">
                {t('overview:readAnswers')}
              </Button>
            </MenuItem>
            <MenuItem>
              {moreThanFiveProgrammes && (
                <Button data-cy="nav-comparison" as={Link} to="/comparison?form=4" size="big">
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
              showAllProgrammes={showAllProgrammes}
              handleShowProgrammes={handleShowProgrammes}
            />
          </div>
        </>
      ) : (
        <NoPermissions t={t} requestedForm={t('evaluation')} />
      )}
    </>
  )
}
