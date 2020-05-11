import React, { useState, useEffect } from 'react'
import { Header, Input, Select, Radio } from 'semantic-ui-react'
import SmileyTable from './SmileyTable'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import OspaModule from './OspaModule'
import ProgramControlsContent from './ProgramControlsContent'
import CustomModal from 'Components/Generic/CustomModal'

export default () => {
  const [filter, setFilter] = useState('')
  const [year, setYear] = useState(2020)
  const [modalData, setModalData] = useState(null)
  const [showUnclaimedOnly, setShowUnclaimedOnly] = useState(false)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const languageCode = useSelector((state) => state.language)
  const currentUser = useSelector((state) => state.currentUser)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  const handleChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const handleYearChange = (e, { value }) => {
    setYear(value)
  }

  const translations = {
    noPermissions: {
      fi:
        'Sinulla ei ole oikeuksia millekkään koulutusohjelmalle. Ole hyvä ja ota yhteys Opetuksen Strategisiin Palveluihin tai koulutusohjelman johtajaan.',
      en:
        'You have no permissions for any programmes. Please contact The Strategic Services for Teaching or your programme leader.',
      se: '',
    },
    filter: {
      fi: 'Filtteröi',
      en: 'Filter',
      se: '',
    },
    showUnclaimedOnly: {
      en: 'Show only unclaimed programmes',
      fi: 'Näytä vain lunastamattomat koulutusohjelmat',
      se: '',
    },
    overviewPage: {
      en: 'Form - Overview',
      fi: 'Lomake - Yleisnäkymä ',
      se: '',
    },
  }

  useEffect(() => {
    document.title = `${translations['overviewPage'][languageCode]}`
  }, [languageCode])

  const years = [
    { key: '2019', value: 2019, text: '2019' },
    { key: '2020', value: 2020, text: '2020' },
  ]

  const usersPermissionsKeys = Object.keys(currentUser.data.access)
  const usersProgrammes = currentUser.data.admin
    ? programmes
    : programmes.filter((program) => usersPermissionsKeys.includes(program.key))

  const filteredProgrammes = usersProgrammes.filter((prog) => {
    if (showUnclaimedOnly && prog.claimed) return
    const searchTarget = prog.name[languageCode] ? prog.name[languageCode] : prog.name['en'] // Because sw and fi dont always have values.
    return searchTarget.toLowerCase().includes(filter.toLowerCase())
  })

  return (
    <>
      {modalData && (
        <CustomModal
          title={modalData.header}
          closeModal={() => setModalData(null)}
          borderColor={modalData.color}
        >
          <>
            <div style={{ paddingBottom: '1em' }}>{modalData.programme}</div>
            <div style={{ fontSize: '1.2em' }}>
              <ReactMarkdown source={modalData.content} />
            </div>
          </>
        </CustomModal>
      )}

      {programControlsToShow && (
        <CustomModal
          title={
            programControlsToShow.name[languageCode]
              ? programControlsToShow.name[languageCode]
              : programControlsToShow.name['en']
          }
          closeModal={() => setProgramControlsToShow(null)}
        >
          <ProgramControlsContent programKey={programControlsToShow.key} />
        </CustomModal>
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1em',
              flexDirection: 'column',
            }}
            className="overviewpage-controls"
          >
            <Select
              data-cy="overviewpage-year"
              name="year"
              options={years}
              onChange={handleYearChange}
              value={year}
            />
          </div>
          <OspaModule />
          <div style={{ marginTop: '2em' }}>
            {usersProgrammes.length > 10 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  margin: '1em 0',
                  alignItems: 'center',
                }}
              >
                <Input
                  style={{ width: '200px' }}
                  data-cy="overviewpage-filter"
                  name="filter"
                  icon="filter"
                  placeholder={translations.filter[languageCode]}
                  onChange={handleChange}
                  value={filter}
                />
                {currentUser.data.admin && (
                  <div>
                    <Radio
                      style={{ marginTop: '1em' }}
                      checked={showUnclaimedOnly}
                      onChange={() => setShowUnclaimedOnly(!showUnclaimedOnly)}
                      label={translations['showUnclaimedOnly'][languageCode]}
                      toggle
                    />
                  </div>
                )}
              </div>
            )}
            <SmileyTable
              filteredProgrammes={filteredProgrammes}
              setModalData={setModalData}
              year={year}
              setProgramControlsToShow={setProgramControlsToShow}
            />
          </div>
        </>
      ) : (
        <Header style={{ textAlign: 'center', paddingTop: '5em' }} as="h2" disabled>
          {translations.noPermissions[languageCode]}
        </Header>
      )}
    </>
  )
}
