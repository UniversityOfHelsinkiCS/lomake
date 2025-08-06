import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Checkbox, Container, Dropdown, Header, Input, Segment } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { saveTempAccessAction, deleteTempAccessAction } from '../../redux/usersReducer'
import { fi, enGB, sv } from 'date-fns/locale'
import { isAdmin } from '../../../config/common'
import TempAccessTable from './TempAccessTable'
import './UsersPage.scss'

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
      kojoEmail: kojoEmail.trim(),
      givenBy: currentUser.uid,
      progNames: programmes.find(p => p.key === key).name,
    }
    dispatch(saveTempAccessAction(newRight))
    handleCancel()
  }

  const handleEdit = row => {
    setEmail(row.email)
    setProgramme(row.progName)
    setWriting(row.writingRights)
    window.scrollTo(0, 0)
  }

  const handleDelete = row => {
    dispatch(deleteTempAccessAction(row.uid, row.programme))
  }

  registerLocale('fi', fi)
  registerLocale('en', enGB)
  registerLocale('se', sv)

  return (
    <Segment>
      <div>
        <Header as="h3"> {t('users:tempAccessMangement')} </Header>
        <Container fluid className="temp-access-info">
          {t('users:tempAccessInfo1')} <br />
          {t('users:tempAccessInfo2')}
        </Container>
        <Container fluid className="temp-access-info">
          <i>{t('users:tempAccessNote')}</i>
        </Container>
        <br />
      </div>
      <div className="temp-access-details">
        <div>
          <Header as="h5"> {t('users:receiverEmail')}</Header>
          <Input
            name="email"
            className="email-input"
            placeholder={t('email')}
            onChange={(e, { value }) => setEmail(value)}
            value={email}
          />
        </div>
        <div>
          <Header as="h5">{t('users:accessProgramme')}</Header>
          <Dropdown
            selection
            search
            placeholder={t('programmeHeader')}
            value={programme}
            onChange={(e, { value }) => setProgramme(value)}
            options={options}
            data-cy="programme-filter"
          />
        </div>
        <div>
          <Header as="h5">{t('users:endOfAccess')}</Header>
          <DatePicker
            dateFormat="dd.MM.yyyy"
            placeholderText={t('choose')}
            minDate={new Date()}
            selected={endDate}
            onChange={setEndDate}
            locale={lang}
          />
        </div>
      </div>
      <div className="temp-access-input">
        <Header as="h5">{t('users:kojoEmail')}</Header>
        <Input
          name="kojoEmail"
          className="kojoEmail-input"
          placeholder={t('email')}
          onChange={(e, { value }) => setKojoEmail(value)}
          value={kojoEmail}
        />
      </div>
      <div className="temp-access-input">
        <Checkbox
          label={t('users:giveWritingRights')}
          onChange={(e, data) => setWriting(data.checked)}
          checked={writing}
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
          {t('users:saveRight')}
        </Button>
        <Button data-cy="cancelTempAcces" negative compact size="mini" onClick={handleCancel}>
          {t('cancel')}
        </Button>
      </div>
      <TempAccessTable programmes={programmes} lang={lang} handleEdit={handleEdit} handleDelete={handleDelete} />
    </Segment>
  )
}

export default TempAccess
