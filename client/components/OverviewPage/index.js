import React, { useState } from 'react'
import { Modal, Header, Input, Select, Radio } from 'semantic-ui-react'
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

  const backgroundColorMap = {
    green: '#9dff9d',
    yellow: '#ffffb1',
    red: '#ff7f7f',
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
  }

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
      <Modal open={!!modalData} onClose={() => setModalData(null)} basic size="small" closeIcon>
        {/* Right now header is showing the question id but in the final version the full question is shown */}
        <Header icon="question" content={modalData ? modalData.header : ''} />
        <Modal.Content>
          <Modal.Description>
            <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
              {modalData ? modalData.programme : ''}
            </span>
          </Modal.Description>
          <span
            style={{
              color: backgroundColorMap[modalData ? modalData.color : 'green'],
            }}
          >
            <ReactMarkdown source={modalData ? modalData.content : ''} />
          </span>
        </Modal.Content>
      </Modal>

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
            style={{ display: 'flex', alignItems: 'center', padding: '1em' }}
            className="overviewpage-controls"
          >
            <Input
              data-cy="overviewpage-filter"
              name="filter"
              icon="filter"
              placeholder={translations.filter[languageCode]}
              onChange={handleChange}
              value={filter}
            />
            <Select
              data-cy="overviewpage-year"
              name="year"
              options={years}
              onChange={handleYearChange}
              value={year}
            />
            {currentUser.data.admin && (
              <Radio
                checked={showUnclaimedOnly}
                onChange={() => setShowUnclaimedOnly(!showUnclaimedOnly)}
                label={translations['showUnclaimedOnly'][languageCode]}
                toggle
              />
            )}
          </div>
          <OspaModule />
          <div style={{ marginTop: '2em' }}>
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
