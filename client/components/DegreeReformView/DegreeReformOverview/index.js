import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'

import { Radio, Dropdown } from 'semantic-ui-react'
import { isAdmin } from '@root/config/common'
import { useVisibleOverviewProgrammes } from 'Utilities/overview'
import useDebounce from 'Utilities/useDebounce'
import CustomModal from 'Components/Generic/CustomModal'
import NoPermissions from 'Components/Generic/NoPermissions'
import { getForm, filterFromUrl } from 'Utilities/common'
import { getFacultyReformAnswers, getUniversityReformAnswers } from 'Utilities/redux/reformAnswerReducer'
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

  // eslint-disable-next-line consistent-return
  return (
    <div>
      {questionData.slice(1).map(group => (
        <TextQuestionGroup key={group.id} questionGroup={group} answers={data} />
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
        const selectedFaculties = dropdownFilter.length < 1 ? 'UNI' : dropdownFilter
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

  const handleDropDownFilter = (e, code, selected) => {
    e.stopPropagation()
    if (selected) {
      setDropdownFilter(dropdownFilter.filter(f => f !== code))
    } else {
      setDropdownFilter(dropdownFilter.concat(code))
    }
  }

  const usersProgrammes = useVisibleOverviewProgrammes(currentUser, programmes, showAllProgrammes)

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

  let facultyProgrammes = null
  let nameOf = null

  if (faculty) {
    if (faculty === 'UNI') {
      if (dropdownFilter.length > 0) {
        facultyProgrammes = programmes.filter(p => dropdownFilter.includes(p.primaryFaculty.code))
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
          <ProgramControlsContent programKey={programControlsToShow.key} form={getForm(formType)} />
        </CustomModal>
      )}

      {statsToShow && (
        <CustomModal title={statsToShow.title} closeModal={() => setStatsToShow(null)}>
          <StatsContent statsToShow={statsToShow} />
        </CustomModal>
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <div className={moreThanFiveProgrammes ? 'wide-header' : 'wideish-header'}>
            <h2 className="view-title">{t('degree-reform').toUpperCase()}</h2>
          </div>
          {faculty === 'UNI' && (
            <div className="table-container-degree-reform-filter">
              <Dropdown text={t('facultyFilter')} icon="filter" button labeled className="icon">
                <Dropdown.Menu defaultUpward="false" upward="false">
                  <Dropdown.Divider />
                  {faculties.data.map(f => {
                    const selected = dropdownFilter.includes(f.code)
                    return (
                      <Dropdown.Item
                        key={f.code}
                        onClick={e => handleDropDownFilter(e, f.code, selected)}
                        text={f.name[lang]}
                        multiple
                        active={selected}
                        label={selected && { color: 'blue', empty: true, circular: true }}
                      />
                    )
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
          <div style={{ marginTop: '1em' }}>
            <ColorTable
              filteredProgrammes={filteredProgrammes}
              facultyProgrammes={facultyProgrammes}
              setModalData={setModalData}
              setProgramControlsToShow={setProgramControlsToShow}
              setStatsToShow={setStatsToShow}
              isBeingFiltered={debouncedFilter !== ''}
              handleFilterChange={handleFilterChange}
              filterValue={filter}
              formType={formType}
              handleShowProgrammes={handleShowProgrammes}
              showAllProgrammes={showAllProgrammes}
              form={2}
              facultyView={faculty}
              individualAnswers={reformAnswers?.data}
              dropdownFilter={dropdownFilter}
            />
          </div>
          {faculty && (
            <div style={{ marginTop: 50 }}>
              <h3>{t('generic:individualTxt')}</h3>
              <Radio
                style={{ marginRight: 'auto', marginBottom: '2em' }}
                toggle
                onChange={() => setTextualVisible(!textualVisible)}
                checked={textualVisible}
                label={t('formView:showAnswers')}
              />
            </div>
          )}
          {textualVisible && <TextualAnswers reformAnswers={reformAnswers} />}
        </>
      ) : (
        <NoPermissions t={t} />
      )}
    </>
  )
}
