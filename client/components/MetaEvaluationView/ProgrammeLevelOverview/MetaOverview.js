import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { Button, Dropdown, Message } from 'semantic-ui-react'
import { isAdmin } from '@root/config/common'
import { filterFromUrl } from 'Utilities/common'
import { setYear } from 'Utilities/redux/filterReducer'
import { data as facultyList } from '@root/config/data'
import useDebounce from 'Utilities/useDebounce'

import CsvDownload from 'Components/Generic/CsvDownload'
import CustomModal from 'Components/Generic/CustomModal'
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
  const [usersProgrammes, setUsersProgrammes] = useState(programmes)
  const [dropdownText, setDropdownText] = useState(t('chooseFaculty'))

  const debouncedFilter = useDebounce(filter, 200)
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const deadlineInfo = nextDeadline?.find(a => a.form === form)

  useEffect(() => {
    const filterQuery = filterFromUrl()
    if (filterQuery) setFilter(filterQuery)
    dispatch(setYear(year))
    document.title = t('evaluation')
  }, [dispatch, year, t, lang])

  const filteredProgrammes = useMemo(() => {
    return usersProgrammes.filter(
      prog =>
        prog.name[lang].toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        prog.key.toLowerCase().includes(debouncedFilter.toLowerCase()),
    )
  }, [usersProgrammes, lang, debouncedFilter])

  const moreThanFiveProgrammes = useMemo(
    () => isAdmin(currentUser.data) || (currentUser.data.access && Object.keys(currentUser.data.access).length > 5),
    [currentUser],
  )

  const handleFilterChange = e => setFilter(e.target.value)

  const handleDropdownFilter = faculty => {
    if (!faculty) {
      setDropdownText(t('chooseFaculty'))
      setUsersProgrammes(programmes)
      return
    }

    setDropdownText(faculty.name[lang])
    const facultyData = facultyList.find(item => item.code === faculty.code)
    const filteredPrograms = facultyData.programmes
      .filter(item => (doctoral ? item.level === 'doctoral' : item.level !== 'doctoral'))
      .map(program => program.key)

    setUsersProgrammes(programmes.filter(a => filteredPrograms.includes(a.key)))
  }

  const renderModal = () => {
    if (modalData) {
      return (
        <CustomModal title={modalData.header} closeModal={() => setModalData(null)} borderColor={modalData.color}>
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
          title={`${t('overview:accessRights')} - ${programControlsToShow.name[lang]}`}
          closeModal={() => setProgramControlsToShow(null)}
        >
          <ProgramControlsContent programKey={programControlsToShow.key} form={form} />
        </CustomModal>
      )
    }
    if (statsToShow) {
      return (
        <CustomModal title={statsToShow.title} closeModal={() => setStatsToShow(null)}>
          <StatsContent stats={statsToShow.stats} />
        </CustomModal>
      )
    }
    return null
  }

  return (
    <>
      {renderModal()}
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
        <Dropdown data-cy="faculty-dropdown" text={dropdownText} className="button basic gray">
          <Dropdown.Menu>
            <Dropdown.Item data-cy="dropdown-item-all" onClick={() => handleDropdownFilter('')}>
              {t('report:all')}
            </Dropdown.Item>
            {faculties?.data.map(faculty => (
              <Dropdown.Item
                data-cy={`dropdown-item-${faculty.code}`}
                key={faculty.code}
                onClick={() => handleDropdownFilter(faculty)}
              >
                {faculty.name[lang]}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown
          data-cy="csv-download"
          className="button basic gray csv-download"
          direction="left"
          text={t('overview:csvDownload')}
          onClick={() => setShowCsv(!showCsv)}
        >
          <Dropdown.Menu>
            <Dropdown.Item>
              <CsvDownload wantedData="written" view="overview" form={form} />
            </Dropdown.Item>
            <Dropdown.Item>
              <CsvDownload wantedData="colors" view="overview" form={form} />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>{' '}
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
          handleShowProgrammes={() => setShowAllProgrammes(!showAllProgrammes)}
          doctoral={doctoral}
        />
      </div>
    </>
  )
}

export default MetaOverview
