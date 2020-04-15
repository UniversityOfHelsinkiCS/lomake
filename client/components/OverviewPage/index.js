import React, { useState } from 'react'
import './OverviewPage.scss'
import { Modal, Header, Input } from 'semantic-ui-react'
import SmileyTable from './SmileyTable'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'

export default () => {
  const [filter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)
  const languageCode = useSelector((state) => state.language)
  const currentUser = useSelector((state) => state.currentUser)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  const handleChange = ({ target }) => {
    const { value } = target
    setFilter(value)
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
  }

  const usersProgrammes = currentUser.data.admin ? programmes : Object.keys(currentUser.data.access)

  const filteredProgrammes = usersProgrammes.filter((prog) => {
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

      {usersProgrammes.length > 0 ? (
        <>
          <Input
            data-cy="overviewpage-filter"
            name="filter"
            icon="filter"
            placeholder={translations.filter[languageCode]}
            onChange={handleChange}
            value={filter}
            size="huge"
          />
          <div style={{ marginTop: '2em' }}>
            <SmileyTable filteredProgrammes={filteredProgrammes} setModalData={setModalData} />
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
