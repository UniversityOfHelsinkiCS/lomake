import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import CsvDownload from 'Components/Generic/CsvDownload'
import { Button, Dropdown, Message } from 'semantic-ui-react'
import { filterFromUrl } from 'Utilities/common'
import { isAdmin } from '@root/config/common'
import useDebounce from 'Utilities/useDebounce'
import CustomModal from 'Components/Generic/CustomModal'
import { setYear } from 'Utilities/redux/filterReducer'
import { data as facultyList } from '@root/config/data'
import ColorTable from '../../OverviewPage/ColorTable'
import StatsContent from '../../OverviewPage/StatsContent'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'

const MetaOverview = ({
  t,
  lang,
  dispatch,
  currentUser,
  faculties,
  programmes,
  year,
  form,
  formType,
  doctoral,
  showAllProgrammes,
  setShowAllProgrammes,
}) => {
  const [filter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)
  const [showCsv, setShowCsv] = useState(false)

  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const debouncedFilter = useDebounce(filter, 200)
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const deadlineInfo = nextDeadline ? nextDeadline.find(a => a.form === form) : null

  const [usersProgrammes, setUsersProgrammes] = useState(programmes)

  useEffect(() => {
    const filterQuery = filterFromUrl()
    if (filterQuery) {
      setFilter(filterQuery)
    }
    dispatch(setYear(year))
  }, [dispatch])

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

  const handleDropdownFilter = value => {
    if (value === '') {
      setUsersProgrammes(programmes)
      return
    }

    const temp = facultyList.find(item => item.code === value)
    if (doctoral) {
      const res = temp.programmes.filter(item => item.level === 'doctoral')
      const resKeys = res.map(program => program.key)
      setUsersProgrammes(programmes.filter(a => resKeys.includes(a.key)))
    } else {
      const res = temp.programmes.filter(item => item.level !== 'doctoral')
      const resKeys = res.map(program => program.key)
      setUsersProgrammes(programmes.filter(a => resKeys.includes(a.key)))
    }
  }

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
          title={`${t('overview:accessRights')} - ${programControlsToShow.name[lang]}`}
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
        <Dropdown text="filter by faculty" className="button basic gray">
          <Dropdown.Menu>
            <Dropdown.Item>
              <div onClick={() => handleDropdownFilter('')}>{t('all')}</div>
            </Dropdown.Item>
            {faculties &&
              faculties.data.map(faculty => {
                return (
                  <Dropdown.Item>
                    <div key={faculty.code} onClick={() => handleDropdownFilter(faculty.code)}>
                      {faculty.name[lang]}
                    </div>
                  </Dropdown.Item>
                )
              })}
          </Dropdown.Menu>
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
  )
}

export default MetaOverview
