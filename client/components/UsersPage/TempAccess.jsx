/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, TextField, Typography, Checkbox, Autocomplete, Box, FormControlLabel } from '@mui/material'
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
    <Box>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 4 }}>
        <Typography variant="h3"> {t('users:tempAccessMangement')} </Typography>
        <Typography>{t('users:tempAccessInfo1')}</Typography>
        <Typography>{t('users:tempAccessInfo2')}</Typography>
        <Typography>
          <i>{t('users:tempAccessNote')}</i>
        </Typography>
        <br />
      </div>
      <div className="temp-access-details">
        <div>
          <Typography variant="h5"> {t('users:receiverEmail')}</Typography>
          <TextField
            className="email-input"
            label={t('email')}
            name="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div>
          <Typography variant="h5"> {t('users:accessProgramme')}</Typography>
          <Autocomplete
            data-cy="programme-filter"
            freeSolo={false}
            fullWidth
            onChange={(_, newValue) => setProgramme(newValue || '')}
            options={options.map(o => o.value)}
            renderInput={params => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <TextField {...params} label={t('programmeHeader')} placeholder={t('programmeHeader')} />
            )}
            value={programme || null}
          />
        </div>
        <div>
          <Typography variant="h5">{t('users:kojoEmail')}</Typography>
          <TextField
            className="kojoEmail-input"
            label={t('email')}
            name="kojoEmail"
            onChange={e => setKojoEmail(e.target.value)}
            value={kojoEmail}
          />
        </div>
      </div>
      <div className="temp-access-input">
        <div>
          <Typography variant="h5">{t('users:endOfAccess')}</Typography>
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
        <FormControlLabel
          control={<Checkbox checked={writing} onChange={e => setWriting(e.target.checked)} />}
          label={t('users:giveWritingRights')}
        />
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        <Button
          data-cy="saveTempAcces"
          disabled={!endDate || !email || !kojoEmail || !programme}
          onClick={handleSave}
          variant="contained"
        >
          {t('users:saveRight')}
        </Button>
        <Button data-cy="cancelTempAcces" onClick={handleCancel} sx={{ backgroundColor: 'red' }} variant="contained">
          {t('cancel')}
        </Button>
      </div>
      <TempAccessTable handleDelete={handleDelete} handleEdit={handleEdit} lang={lang} programmes={programmes} />
    </Box>
  )
}

export default TempAccess
