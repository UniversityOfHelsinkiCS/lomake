import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Checkbox, Container, Dropdown, Header, Input, Segment } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { fi, enGB, sv } from 'date-fns/locale'

const TempAccess = () => {
  const { t } = useTranslation()
  // const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const programmes = useSelector(state => state.studyProgrammes.data)
  // const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const [uid, setUid] = useState('')
  const [programme, setProgramme] = useState('')
  const [endDate, setEndDate] = useState(null)
  const [writing, setWriting] = useState(false)
  const [email, setEmail] = useState('')

  const options = programmes.map(p => ({
    key: p.key,
    value: p.name[lang],
    text: p.name[lang],
  }))

  const handleCancel = () => {
    setEndDate(null)
    setUid('')
    setProgramme('')
    setWriting(false)
    setEmail('')
  }

  const handleSave = () => {
    // const { key } = options.find(o => o.value === programme)
    // const newRight = {
    //   uid,
    //   programme: key,
    //   endDate,
    //   writingRights: writing,
    //   kojoEmail: email,
    //   givenBy: currentUser.uid,
    // }
    // dispatch(saveTempAccess(newRight))
    handleCancel()
  }

  registerLocale('fi', fi)
  registerLocale('en', enGB)
  registerLocale('se', sv)

  // inlinet
  // käännökset
  // and draftyear

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
        <Header as="h5"> Käyttäjätunnus, jolle oikeudet annetaan</Header>
        <Input
          name="uid"
          className="uid-input"
          placeholder={t('users:userId')}
          onChange={(e, { value }) => setUid(value)}
          value={uid}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <Header as="h5">{t('comparison:chosenProgrammes')}</Header>
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
        <Header as="h5">Valitse käyttöoikeuden viimeinen voimassaolopäivä</Header>
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
        <Header as="h5"> Koulutusryhmän johtajan sähköpostiosoite</Header>
        <Input
          name="email"
          className="email-input"
          placeholder="Sähköpostiosoite"
          onChange={(e, { value }) => setEmail(value)}
          value={email}
        />
      </div>
      <div>
        <Button
          data-cy="saveTempAcces"
          primary
          compact
          size="mini"
          disabled={!endDate || !uid || !email || !programme}
          onClick={handleSave}
        >
          Tallenna oikeus
        </Button>
        <Button data-cy="cancelTempAcces" negative compact size="mini" onClick={handleCancel}>
          Peruuta
        </Button>
      </div>
    </Segment>
  )
}

export default TempAccess
