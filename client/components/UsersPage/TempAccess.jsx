/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Checkbox, Container, Dropdown, Header, Input, Segment } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
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
  const navigate = useNavigate()
  const lang = useSelector(state => state.language)
  const programmes = useSelector(state => state.studyProgrammes.data)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const [email, setEmail] = useState('')
  const [programme, setProgramme] = useState('')
  const [endDate, setEndDate] = useState(null)
  const [writing, setWriting] = useState(false)
  const [kojoEmail, setKojoEmail] = useState('')

  if (!isAdmin(currentUser)) {
    navigate('/')
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
        <Container className="temp-access-info" fluid>
          {t('users:tempAccessInfo1')} <br />
          {t('users:tempAccessInfo2')}
        </Container>
        <Container className="temp-access-info" fluid>
          <i>{t('users:tempAccessNote')}</i>
        </Container>
        <br />
      </div>
      <div className="temp-access-details">
        <div>
          <Header as="h5"> {t('users:receiverEmail')}</Header>
          <Input
            className="email-input"
            name="email"
            onChange={(e, { value }) => setEmail(value)}
            placeholder={t('email')}
            value={email}
          />
        </div>
        <div>
          <Header as="h5">{t('users:accessProgramme')}</Header>
          <Dropdown
            data-cy="programme-filter"
            onChange={(e, { value }) => setProgramme(value)}
            options={options}
            placeholder={t('programmeHeader')}
            search
            selection
            value={programme}
          />
        </div>
        <div>
          <Header as="h5">{t('users:endOfAccess')}</Header>
          <DatePicker
            dateFormat="dd.MM.yyyy"
            locale={lang}
            minDate={new Date()}
            onChange={setEndDate}
            placeholderText={t('choose')}
            selected={endDate}
          />
        </div>
      </div>
      <div className="temp-access-input">
        <Header as="h5">{t('users:kojoEmail')}</Header>
        <Input
          className="kojoEmail-input"
          name="kojoEmail"
          onChange={(e, { value }) => setKojoEmail(value)}
          placeholder={t('email')}
          value={kojoEmail}
        />
      </div>
      <div className="temp-access-input">
        <Checkbox
          checked={writing}
          label={t('users:giveWritingRights')}
          onChange={(e, data) => setWriting(data.checked)}
        />
      </div>
      <div>
        <Button
          compact
          data-cy="saveTempAcces"
          disabled={!endDate || !email || !kojoEmail || !programme}
          onClick={handleSave}
          primary
          size="mini"
        >
          {t('users:saveRight')}
        </Button>
        <Button compact data-cy="cancelTempAcces" negative onClick={handleCancel} size="mini">
          {t('cancel')}
        </Button>
      </div>
      <TempAccessTable handleDelete={handleDelete} handleEdit={handleEdit} lang={lang} programmes={programmes} />
    </Segment>
  )
}

export default TempAccess
