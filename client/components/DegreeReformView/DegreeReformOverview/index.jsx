/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'

import { Radio, Dropdown, List, ListItem, ListIcon, ListContent, Menu, MenuItem } from 'semantic-ui-react'
import { useVisibleOverviewProgrammes } from '../../../util/overview'
import useDebounce from '../../../util/useDebounce'
import CustomModal from '../../Generic/CustomModal'
import NoPermissions from '../../Generic/NoPermissions'
import { getForm, filterFromUrl } from '../../../util/common'
import { getFacultyReformAnswers, getUniversityReformAnswers } from '../../../redux/reformAnswerReducer'
import YearSelector from '../../Generic/YearSelector'
import ColorTable from '../../OverviewPage/ColorTable'
import StatsContent from '../../OverviewPage/StatsContent'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'
import { degreeReformIndividualQuestions as questionData } from '../../../questionData'
import { TextQuestionGroup } from '../../ReformAnswers'

const TextualAnswers = ({ reformAnswers }) => {
  const { data } = reformAnswers

  if (!data) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/consistent-return
  return (
    <div>
      {questionData.slice(1).map(group => (
        <TextQuestionGroup answers={data} key={group.id} questionGroup={group} />
      ))}
    </div>
  )
}

const getFacultyFromUrl = () => {
  const url = window.location.href
  const facStart = url.indexOf('faculty=')
  if (facStart === -1) {
    return undefined
  }
  let faculty = url.substring(facStart + 8)

  const facEnd = faculty.indexOf('&')
  if (facEnd !== -1) {
    faculty = faculty.substring(0, facEnd)
  }

  return faculty
}

export default () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [statsToShow, setStatsToShow] = useState(null)
  const [showAllProgrammes, setShowAllProgrammes] = useState(false)
  const [faculty, setFaculty] = useState(null)
  const [textualVisible, setTextualVisible] = useState(false)
  const [dropdownFilter, setDropdownFilter] = useState([])
  const dispatch = useDispatch()

  const debouncedFilter = useDebounce(filter, 200)
  const currentUser = useSelector(({ currentUser }) => currentUser)
  const lang = useSelector(state => state.language)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const faculties = useSelector(({ faculties }) => faculties)
  const reformAnswers = useSelector(state => state.reformAnswers)
  useEffect(() => {
    const filterQuery = filterFromUrl()
    if (filterQuery) {
      setFilter(filterQuery)
    }
  }, [])

  useEffect(() => {
    const facultyFromUrl = getFacultyFromUrl()
    setFaculty(facultyFromUrl)
  }, [])

  useEffect(() => {
    if (faculty) {
      if (faculty === 'UNI') {
        const dropdownFilterWithOnlyCodes = dropdownFilter.map(f => f.code)
        const selectedFaculties = dropdownFilterWithOnlyCodes.length < 1 ? 'UNI' : dropdownFilterWithOnlyCodes
        dispatch(getUniversityReformAnswers(selectedFaculties))
      } else {
        dispatch(getFacultyReformAnswers(faculty))
      }
    }
  }, [faculty, dropdownFilter])

  useEffect(() => {
    document.title = `${t('degree-reform')}`
  }, [lang])

  const formType = 'degree-reform'

  const handleFilterChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const handleShowProgrammes = () => {
    setShowAllProgrammes(!showAllProgrammes)
  }

  const handleDropDownFilter = (e, faculty, selected) => {
    e.stopPropagation()
    if (selected) {
      setDropdownFilter(dropdownFilter.filter(f => f.code !== faculty.code))
    } else {
      const facultyObject = { name: faculty.name[lang], code: faculty.code }
      setDropdownFilter(dropdownFilter.concat(facultyObject))
    }
  }

  const usersProgrammes = useVisibleOverviewProgrammes({
    currentUser,
    programmes,
    showAllProgrammes,
    faculty,
    dropdownFilter,
  })

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

  let facultyProgrammes = null
  let nameOf = null

  if (faculty) {
    if (faculty === 'UNI') {
      if (dropdownFilter.length > 0) {
        const dropdownFilterWithOnlyCodes = dropdownFilter.map(f => f.code)
        facultyProgrammes = programmes.filter(p => dropdownFilterWithOnlyCodes.includes(p.primaryFaculty.code))
      } else {
        facultyProgrammes = programmes
      }

      nameOf = () => t('generic:level:university')
    } else {
      const facultyObject = faculties.data.find(f => f.code === faculty)
      let facultyProgrammeCodes = facultyObject.ownedProgrammes.map(p => p.key)

      if (showAllProgrammes) {
        facultyProgrammeCodes = facultyProgrammeCodes.concat(facultyObject.companionStudyprogrammes.map(p => p.key))
      }

      facultyProgrammes = programmes.filter(p => facultyProgrammeCodes.includes(p.key))
      nameOf = faculty => faculties.data.find(f => f.code === faculty).name[lang]
    }
  }
  return (
    <>
      {faculty && <h2 style={{ marginTop: 5 }}>{nameOf(faculty)}</h2>}
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
          <ProgramControlsContent form={getForm(formType)} programKey={programControlsToShow.key} />
        </CustomModal>
      )}

      {statsToShow && (
        <CustomModal closeModal={() => setStatsToShow(null)} title={statsToShow.title}>
          <StatsContent statsToShow={statsToShow} />
        </CustomModal>
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <Menu className="filter-row" secondary size="large">
            <MenuItem>
              <h2>{t('degree-reform').toUpperCase()}</h2>
            </MenuItem>
            <MenuItem>
              <YearSelector size="extra-small" />
            </MenuItem>
            <MenuItem>{dropdownFilter.length > 0 && <h3>{t('generic:chosenFaculties')}</h3>}</MenuItem>
            {faculty === 'UNI' && faculties.data.length > 0 && (
              <>
                <MenuItem>
                  <List>
                    {dropdownFilter.length > 0 &&
                      dropdownFilter.map(f => (
                        <ListItem>
                          <ListIcon color="blue" name="circle" />
                          <ListContent> {f.name}</ListContent>
                        </ListItem>
                      ))}
                  </List>
                </MenuItem>
                <MenuItem>
                  <Dropdown button className="icon" defaultUpward={false} labeled text={t('overview:chooseFaculty')}>
                    <Dropdown.Menu upward="false">
                      <Dropdown.Divider />
                      {faculties.data.map(f => {
                        const selected = dropdownFilter.filter(d => d.code === f.code).length > 0
                        return (
                          <Dropdown.Item
                            active={selected}
                            key={f.code}
                            label={selected ? { color: 'blue', empty: true, circular: true } : null}
                            multiple
                            onClick={e => handleDropDownFilter(e, f, selected)}
                            text={f.name[lang]}
                          />
                        )
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </MenuItem>
              </>
            )}
          </Menu>
          <div>
            <ColorTable
              dropdownFilter={dropdownFilter}
              facultyProgrammes={facultyProgrammes}
              facultyView={faculty}
              filterValue={filter}
              filteredProgrammes={filteredProgrammes}
              form={2}
              formType={formType}
              handleFilterChange={handleFilterChange}
              handleShowProgrammes={handleShowProgrammes}
              individualAnswers={reformAnswers?.data}
              isBeingFiltered={debouncedFilter !== ''}
              setModalData={setModalData}
              setProgramControlsToShow={setProgramControlsToShow}
              setStatsToShow={setStatsToShow}
              showAllProgrammes={showAllProgrammes}
            />
          </div>
          {faculty && (
            <div style={{ marginTop: 50 }}>
              <h3>{t('generic:individualTxt')}</h3>
              <Radio
                checked={textualVisible}
                label={t('formView:showAnswers')}
                onChange={() => setTextualVisible(!textualVisible)}
                style={{ marginRight: 'auto', marginBottom: '2em' }}
                toggle
              />
            </div>
          )}
          {textualVisible && <TextualAnswers reformAnswers={reformAnswers} />}
        </>
      ) : (
        <NoPermissions requestedForm={t('degree-reform')} t={t} />
      )}
    </>
  )
}
