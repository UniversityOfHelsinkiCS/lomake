import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { Link, useLocation } from 'react-router-dom'
import CsvDownload from 'Components/Generic/CsvDownload'
import { Button, Dropdown, Message } from 'semantic-ui-react'
import { filterFromUrl } from 'Utilities/common'
import { useVisibleOverviewProgrammes } from 'Utilities/overview'
import { isAdmin } from '@root/config/common'
import useDebounce from 'Utilities/useDebounce'
import CustomModal from 'Components/Generic/CustomModal'
import NoPermissions from 'Components/Generic/NoPermissions'
import { setYear } from 'Utilities/redux/filterReducer'
import { formKeys } from '@root/config/data'
import ColorTable from '../../OverviewPage/ColorTable'
import StatsContent from '../../OverviewPage/StatsContent'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'

const ProgrammeLevelOverview = () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)
  const [showCsv, setShowCsv] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()

  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const [showAllProgrammes, setShowAllProgrammes] = useState(false)
  const debouncedFilter = useDebounce(filter, 200)
  const currentUser = useSelector(({ currentUser }) => currentUser)
  const lang = useSelector(state => state.language)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const form = formKeys.META_EVALUATION
  const formType = 'meta-evaluation'
  const deadlineInfo = nextDeadline ? nextDeadline.find(a => a.form === form) : null
  const [doctoral, setDoctoral] = useState(false)

  const year = 2024

  useEffect(() => {
    const filterQuery = filterFromUrl()
    if (filterQuery) {
      setFilter(filterQuery)
    }
    dispatch(setYear(year))

    if (location.pathname.endsWith('doctor')) {
      setDoctoral(true)
    } else {
      setDoctoral(false)
    }
  }, [dispatch, location.pathname])

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

  const filterProgrammes = doctoral ? a => a.key.startsWith('T') : a => !a.key.startsWith('T')

  const usersProgrammes = useVisibleOverviewProgrammes({
    currentUser,
    programmes,
    showAllProgrammes,
    year,
    form,
  }).filter(filterProgrammes)

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

      {deadlineInfo && (
        <Message
          icon="clock"
          header={`${draftYear.year} ${t('formView:status:open')}`}
          content={`${t('formCloses')}: ${deadlineInfo.date}`}
        />
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <div className={moreThanFiveProgrammes ? 'wide-header' : 'wideish-header'}>
            <h2 className="view-title">{t('evaluation').toUpperCase()}</h2>
            <Button data-cy="nav-report" as={Link} to="/meta-evaluation/answers" secondary size="big">
              {t('overview:readAnswers')}
            </Button>
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
          </div>
          <div style={{ marginTop: '1em' }}>
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
              doctoral={doctoral}
            />
          </div>
        </>
      ) : (
        <NoPermissions t={t} />
      )}
    </>
  )
}

export default ProgrammeLevelOverview
