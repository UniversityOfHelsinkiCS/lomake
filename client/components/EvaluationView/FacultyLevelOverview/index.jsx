/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react'
import { Button, Dropdown, Menu, MenuItem } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
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
        name.toLowerCase().includes(debouncedFilter.toLowerCase()) ??
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
      {modalData ? (
        <CustomModal borderColor={modalData.color} closeModal={() => setModalData(null)} title={modalData.header}>
          <FacultyCellModal
            accordionsOpen={accordionsOpen}
            modalData={modalData}
            setAccordionsOpen={setAccordionsOpen}
            t={t}
          />
        </CustomModal>
      ) : null}
      {programControlsToShow ? (
        <CustomModal
          closeModal={() => setProgramControlsToShow(null)}
          title={`${t('overview:accessRights')} - ${programControlsToShow.name[lang] ?? programControlsToShow.name.en}`}
        >
          <ProgramControlsContent programKey={programControlsToShow.code} />
        </CustomModal>
      ) : null}

      {usersProgrammes.length > 0 ? (
        <>
          <Menu className="filter-row" secondary size="large">
            <MenuItem>
              <h2>{t('evaluation').toUpperCase()}</h2>
            </MenuItem>
            <MenuItem>
              <Button as={Link} data-cy="nav-report" secondary to="/report?form=5">
                {t('overview:readAnswers')}
              </Button>
            </MenuItem>
            <MenuItem>
              {moreThanFiveProgrammes ? (
                <Button as={Link} data-cy="nav-comparison" to="/comparison?form=5">
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
          <div style={{ marginTop: '1em' }}>
            <FacultyColorTable
              faculties={filteredFaculties}
              filterValue={filter}
              form={form}
              formType={formType}
              handleFilterChange={handleFilterChange}
              isBeingFiltered={debouncedFilter !== ''}
              setModalData={setModalData}
              setProgramControlsToShow={setProgramControlsToShow}
              setStatsToShow={null}
            />
          </div>
        </>
      ) : (
        <NoPermissions requestedForm={t('evaluation')} t={t} />
      )}
    </>
  )
}
