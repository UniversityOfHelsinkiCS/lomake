import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useHistory } from 'react-router'
import { Button, Dropdown, Loader } from 'semantic-ui-react'
import rypsiImage from 'Assets/rypsi.jpg'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import CsvDownload from 'Components/Generic/CsvDownload'
import NoPermissions from 'Components/Generic/NoPermissions'
import YearSelector from 'Components/Generic/YearSelector'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { setViewOnly, getTempAnswers } from 'Utilities/redux/formReducer'
import { formViewTranslations as translations } from 'Utilities/translations'
import { colors } from 'Utilities/common'
import StatusMessage from './StatusMessage'
import SaveIndicator from './SaveIndicator'
import PDFDownload from './PDFDownload'
import NavigationSidebar from './NavigationSidebar'
import Form from './Form'
import questions from '../../questions.json'

const FormView = ({ room }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const lang = useSelector(state => state.language)
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const programme = useSelector(state => state.studyProgrammes.singleProgram)
  const singleProgramPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const user = useSelector(state => state.currentUser.data)
  const year = useSelector(({ filters }) => filters.year)
  const viewingOldAnswers = useSelector(state => state.form.viewingOldAnswers)
  const oldAnswers = useSelector(state => state.oldAnswers.data)
  const currentRoom = useSelector(state => state.room)

  const userHasWriteAccess = (user.access[room] && user.access[room].write) || user.admin
  const userHasReadAccess = (user.access[room] && user.access[room].read) || user.hasWideReadAccess
  const userHasAccessToTempAnswers = user.yearsUserHasAccessTo.includes(year)

  console.log({
    nextDeadline,
    draftYear,
    programme,
    singleProgramPending,
    year,
    viewingOldAnswers,
    userHasWriteAccess,
    userHasReadAccess,
    userHasAccessToTempAnswers,
  })

  const setOldAnswers = () => {
    dispatch(setViewOnly(true))
    if (currentRoom) dispatch(wsLeaveRoom(room))
    const programmesData = oldAnswers ? oldAnswers.find(a => a.programme === programme.key && a.year === year) : null
    const answersFromSelectedYear = programmesData ? programmesData.data : []
    dispatch({
      type: 'SET_OLD_FORM_ANSWERS',
      answers: answersFromSelectedYear,
    })
  }

  useEffect(() => {
    document.title = `${translations.form[lang]} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  useEffect(() => {
    if (!programme) return

    // if the user has no access to tempAnswers, show the answers of the most recent year user has access to
    if (!userHasAccessToTempAnswers) {
      setOldAnswers()
      // if one of these conditions is true, the answers should be read-only
    } else if (programme.locked || !userHasWriteAccess || viewingOldAnswers || (draftYear && draftYear.year !== year) || !nextDeadline) {
      dispatch(setViewOnly(true))
      if (currentRoom) dispatch(wsLeaveRoom(room))

      // if the selected year is this year, and there is a deadline, the user should see the tempAnswers
      if (!viewingOldAnswers && nextDeadline) {
        dispatch(getTempAnswers({ room, year }))
      }
      // if the selected year is this year, and there is no deadline, the newest answers have been moved to old answers and should be found from there
      if (!viewingOldAnswers && !nextDeadline && oldAnswers) {
        setOldAnswers()
      }
      // if the selected year is older than this year and there are old answers, shows them in the form
      if (viewingOldAnswers && oldAnswers) {
        setOldAnswers()
      }
    } else {
      // if none of these conditions is true, the user should be able to write to tempanswers
      dispatch(wsJoinRoom(room))
      dispatch(setViewOnly(false))
    }
  }, [singleProgramPending, viewingOldAnswers, year, nextDeadline, oldAnswers, userHasAccessToTempAnswers])

  useEffect(() => {
    return () => {
      dispatch(wsLeaveRoom(room))
      dispatch({ type: 'RESET_STUDYPROGRAM_SUCCESS' })
    }
  }, [])

  if (!room) return <Redirect to="/" />

  if (!programme) return 'Error: Invalid url.'

  if (!userHasReadAccess && !userHasWriteAccess) return <NoPermissions lang={lang} />

  return singleProgramPending ? (
    <Loader active />
  ) : (
    <div className="form-container">
      <NavigationSidebar programmeKey={programme.key} />
      <div className="the-form">
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
            {translations.title[lang]} {year}
          </h3>

          <div className="hide-in-print-mode">
            <YearSelector size="extra-small" />
            <StatusMessage />

            <p>{translations.p1[lang]}</p>
            <p>{translations.p2[lang]}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              alt="positive-emoji"
              src={positiveEmoji}
              style={{ width: '40px', height: 'auto', marginRight: '5px' }}
            />{' '}
            {translations.positive[lang]}
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
            {translations.neutral[lang]}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
            <img
              src={negativeEmoji}
              alt="negative-emoji"
              style={{ width: '40px', height: 'auto', marginRight: '5px' }}
            />{' '}
            {translations.negative[lang]}
          </div>
        </div>
        <div className="hide-in-print-mode" style={{ marginTop: '2em' }}>
          <Dropdown
            className="button basic gray"
            direction="left"
            text={translations.csvDownload[lang]}
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
