import React, { useState, useEffect, useMemo } from 'react'
import { Button, Dropdown, Menu, MenuItem } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { isAdmin } from '../../../../config/common'
import useDebounce from '../../../util/useDebounce'
import YearSelector from '../../Generic/YearSelector'

import CustomModal from '../../Generic/CustomModal'
import NoPermissions from '../../Generic/NoPermissions'
import CsvDownload from '../../Generic/CsvDownload'
import { formKeys } from '../../../../config/data'
import FacultyColorTable from './FacultyColorTable'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'
import FacultyCellModal from './FacultyCellModal'

export default () => {
  const { t } = useTranslation()
  const [modalData, setModalData] = useState(null)
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const [accordionsOpen, setAccordionsOpen] = useState({})
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [showCsv, setShowCsv] = useState(false)
  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser.data)
  const faculties = useSelector(({ faculties }) => faculties.data)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const form = formKeys.EVALUATION_FACULTIES
  const formType = 'evaluation'

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang])

  const handleFilterChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const userHasAccessToSomething = Object.keys(currentUser.access).length > 0

  // show faculty overview to those that have access to some programmes in tilannekuvalomake
  const usersProgrammes = useMemo(() => {
    return isAdmin(currentUser) || userHasAccessToSomething ? programmes : []
  }, [programmes, currentUser])

  const filteredFaculties = useMemo(() => {
    if (!faculties) return []
    return faculties.filter(f => {
      if (!userHasAccessToSomething && !isAdmin(currentUser)) {
        return false
      }
      if (f.code === 'UNI') return false
      const name = f.name[lang]
      const { code } = f
      return (
        name.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        code.toLowerCase().includes(debouncedFilter.toLowerCase())
      )
    })
  }, [usersProgrammes, faculties, lang, debouncedFilter])

  const moreThanFiveProgrammes = useMemo(() => {
    if (isAdmin(currentUser)) return true
    if (currentUser.access && Object.keys(currentUser.access).length > 5) return true
    return false
  }, [currentUser])

  return (
    <>
      {modalData && (
        <CustomModal title={modalData.header} closeModal={() => setModalData(null)} borderColor={modalData.color}>
          <FacultyCellModal
            modalData={modalData}
            setAccordionsOpen={setAccordionsOpen}
            accordionsOpen={accordionsOpen}
            t={t}
          />
        </CustomModal>
      )}
      {programControlsToShow && (
        <CustomModal
          title={`${t('overview:accessRights')} - ${
            programControlsToShow.name[lang] ? programControlsToShow.name[lang] : programControlsToShow.name.en
          }`}
          closeModal={() => setProgramControlsToShow(null)}
        >
          <ProgramControlsContent programKey={programControlsToShow.code} />
        </CustomModal>
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <Menu size="large" className="filter-row" secondary>
            <MenuItem>
              <h2>{t('evaluation').toUpperCase()}</h2>
            </MenuItem>
            <MenuItem>
              <Button data-cy="nav-report" as={Link} to="/report?form=5" secondary>
                {t('overview:readAnswers')}
              </Button>
            </MenuItem>
            <MenuItem>
              {moreThanFiveProgrammes && (
                <Button data-cy="nav-comparison" as={Link} to="/comparison?form=5">
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
          <div style={{ marginTop: '1em' }}>
            <FacultyColorTable
              faculties={filteredFaculties}
              setModalData={setModalData}
              setProgramControlsToShow={setProgramControlsToShow}
              setStatsToShow={null}
              isBeingFiltered={debouncedFilter !== ''}
              handleFilterChange={handleFilterChange}
              filterValue={filter}
              form={form}
              formType={formType}
            />
          </div>
        </>
      ) : (
        <NoPermissions t={t} requestedForm={t('evaluation')} />
      )}
    </>
  )
}
