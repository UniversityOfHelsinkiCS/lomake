import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useHistory } from 'react-router'
import { Button, Dropdown, Loader } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import rypsiImage from 'Assets/rypsi.jpg'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import CsvDownload from 'Components/Generic/CsvDownload'
import NoPermissions from 'Components/Generic/NoPermissions'
import YearSelector from 'Components/Generic/YearSelector'
import FormStatusMessage from 'Components/Generic/FormStatusMessage'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { setViewOnly, getSingleProgrammesAnswers } from 'Utilities/redux/formReducer'
import { colors } from 'Utilities/common'
import { isAdmin } from '@root/config/common'
import StatusMessage from './StatusMessage'
import SaveIndicator from './SaveIndicator'
import PDFDownload from './PDFDownload'
import NavigationSidebar from './NavigationSidebar'
import Form from './Form'
import questions from '../../questions.json'

const formShouldBeViewOnly = ({ accessToTempAnswers, programme, writeAccess, viewingOldAnswers, draftYear, year }) => {
  if (!accessToTempAnswers) return true
  if (programme.locked) return true
  if (!writeAccess) return true
  if (viewingOldAnswers) return true
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  return false
}

const FormView = ({ room }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()

  const lang = useSelector(state => state.language)
  const draftYear = useSelector(state => state.deadlines.draftYear)
  const programme = useSelector(state => state.studyProgrammes.singleProgram)
  const singleProgramPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const user = useSelector(state => state.currentUser.data)
  const year = useSelector(state => state.filters.year)
  const viewingOldAnswers = useSelector(state => state.form.viewingOldAnswers)
  const currentRoom = useSelector(state => state.room)

  const writeAccess = (user.access[room] && user.access[room].write) || isAdmin(user)
  const readAccess = (user.access[room] && user.access[room].read) || isAdmin(user)
  const accessToTempAnswers = user.yearsUserHasAccessTo.includes(year)

  useEffect(() => {
    document.title = `${t('form')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  useEffect(() => {
    if (!programme) return
    dispatch(getSingleProgrammesAnswers({ room, year, form: 1 })) // To FIX
    if (formShouldBeViewOnly({ accessToTempAnswers, programme, writeAccess, viewingOldAnswers, draftYear, year })) {
      dispatch(setViewOnly(true))
      if (currentRoom) dispatch(wsLeaveRoom(room))
    } else {
      dispatch(wsJoinRoom(room, 1)) // TO FIX
      dispatch(setViewOnly(false))
    }
  }, [
    programme,
    singleProgramPending,
    writeAccess,
    viewingOldAnswers,
    year,
    draftYear,
    accessToTempAnswers,
    readAccess,
    room,
    user,
  ])

  useEffect(() => {
    return () => {
      dispatch(wsLeaveRoom(room))
      dispatch({ type: 'RESET_STUDYPROGRAM_SUCCESS' })
    }
  }, [])

  if (!room) return <Redirect to="/" />

  if (!programme && !singleProgramPending) return 'Error: Invalid url.'

  if (!readAccess && !writeAccess) return <NoPermissions t={t} />

  return singleProgramPending ? (
    <Loader active />
  ) : (
    <div className="form-container">
      <NavigationSidebar programmeKey={programme.key} />
      <div className="the-form">
        <FormStatusMessage programme={room} />
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <SaveIndicator />
            <div style={{ marginBottom: '2em' }}>
              <Button onClick={() => history.push('/')} icon="arrow left" />
            </div>
            <img alt="form-header-rypsi" className="img-responsive" src={rypsiImage} />
          </div>

          <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('formView:title')} {year}
          </h3>

          <div className="hide-in-print-mode">
            <YearSelector size="small" />
            <StatusMessage programme={room} />

            <p>{t('formView:info1')}</p>
            <p>{t('formView:info2')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              alt="positive-emoji"
              src={positiveEmoji}
              style={{ width: '40px', height: 'auto', marginRight: '5px' }}
            />{' '}
            {t('positive')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <img
              src={neutralEmoji}
              alt="neutral-emoji"
              style={{
                width: '40px',
                height: 'auto',
                marginRight: '5px',
                marginTop: '5px',
                marginBottom: '5px',
              }}
            />{' '}
            {t('neutral')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
            <img
              src={negativeEmoji}
              alt="negative-emoji"
              style={{ width: '40px', height: 'auto', marginRight: '5px' }}
            />{' '}
            {t('negative')}
          </div>
        </div>
        <div className="hide-in-print-mode" style={{ marginTop: '2em' }}>
          <Dropdown
            className="button basic gray"
            direction="left"
            text={t('formView:downloadCSV')}
            data-cy="csv-download"
          >
            <Dropdown.Menu>
              <Dropdown.Item content={<CsvDownload programme={programme} view="form" wantedData="written" />} />
              <Dropdown.Item content={<CsvDownload programme={programme} view="form" wantedData="colors" />} />
            </Dropdown.Menu>
          </Dropdown>
          <span style={{ margin: '0 0.5em', color: colors.gray }}>|</span>
          <PDFDownload />
        </div>
        <Form programmeKey={programme.key} questions={questions} />
      </div>
    </div>
  )
}

export default FormView
