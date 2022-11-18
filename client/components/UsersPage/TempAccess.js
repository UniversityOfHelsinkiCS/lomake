import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Checkbox, Container, Dropdown, Header, Input, Segment } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { saveTempAccessAction } from 'Utilities/redux/usersReducer'
import { fi, enGB, sv } from 'date-fns/locale'
import { isAdmin } from '@root/config/common'
import TempAccessTable from './TempAccessTable'

const TempAccess = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const lang = useSelector(state => state.language)
  const programmes = useSelector(state => state.studyProgrammes.data)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const [email, setEmail] = useState('')
  const [programme, setProgramme] = useState('')
  const [endDate, setEndDate] = useState(null)
  const [writing, setWriting] = useState(false)
  const [kojoEmail, setKojoEmail] = useState('')

  if (!isAdmin(currentUser)) {
    history.push('/')
  }

  const options = programmes.map(p => ({
    key: p.key,
    value: p.name[lang],
    text: p.name[lang],
  }))

  const handleCancel = () => {
    setEndDate(null)
    setEmail('')
    setProgramme('')
    setWriting(false)
    setKojoEmail('')
  }

  const handleSave = () => {
    const { key } = options.find(o => o.value === programme)
    const acualDate = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()))
    const newRight = {
      email,
      programme: key,
      endDate: acualDate.toISOString(),
      writingRights: writing,
      kojoEmail,
      givenBy: currentUser.uid,
    }
    dispatch(saveTempAccessAction(newRight))
    handleCancel()
  }

  registerLocale('fi', fi)
  registerLocale('en', enGB)
  registerLocale('se', sv)

  return (
    <Segment>
      <div style={{ margin: '1em 0em 3em 0em' }}>
        <Header as="h3"> {t('users:tempAccessMangement')} </Header>
        <Container fluid style={{ paddingBottom: '10px' }}>
          <b>{t('users:tempAccessNote')}</b>
        </Container>
        <Container fluid style={{ paddingBottom: '10px' }}>
          {t('users:tempAccessInfo')}
        </Container>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <Header as="h5"> Oikeuden saajan helsinki.fi-sähköpostiosoite</Header>
        <Input
          name="email"
          className="email-input"
          placeholder="Sähköpostiosoite"
          onChange={(e, { value }) => setEmail(value)}
          value={email}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <Header as="h5">Koulutusohjelma, johon oikeudet annetaan</Header>
        <Dropdown
          // fluid
          selection
          search
          placeholder={t('comparison:chooseProgramme')}
          value={programme}
          onChange={(e, { value }) => setProgramme(value)}
          options={options}
          data-cy="programme-filter"
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <Header as="h5">Käyttöoikeuden viimeinen voimassaolopäivä</Header>
        <DatePicker
          dateFormat="dd.MM.yyyy"
          placeholderText="Valitse viimeinen voimassaolopäivä"
          minDate={new Date()}
          selected={endDate}
          onChange={setEndDate}
          locale={lang}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <Checkbox label="Anna kirjoitusoikeudet" onChange={(e, data) => setWriting(data.checked)} checked={writing} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <Header as="h5"> Koulutusohjelman johtajan sähköpostiosoite</Header>
        <Input
          name="kojoEmail"
          className="kojoEmail-input"
          placeholder="Sähköpostiosoite"
          onChange={(e, { value }) => setKojoEmail(value)}
          value={kojoEmail}
        />
      </div>
      <div>
        <Button
          data-cy="saveTempAcces"
          primary
          compact
          size="mini"
          disabled={!endDate || !email || !kojoEmail || !programme}
          onClick={handleSave}
        >
          Tallenna oikeus
        </Button>
        <Button data-cy="cancelTempAcces" negative compact size="mini" onClick={handleCancel}>
          Peruuta
        </Button>
      </div>
      <TempAccessTable programmes={programmes} lang={lang} />
    </Segment>
  )
}

export default TempAccess
