import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useHistory } from 'react-router'
import { Button, Dropdown, Loader } from 'semantic-ui-react'
import rypsi_image from 'Assets/rypsi.jpg'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import Form from './Form'
import NavigationSidebar from './NavigationSidebar'
import PDFDownload from './PDFDownload'
import SaveIndicator from './SaveIndicator'
import StatusMessage from './StatusMessage'
import CsvDownload from 'Components/Generic/CsvDownload'
import NoPermissions from 'Components/Generic/NoPermissions'
import YearSelector from 'Components/Generic/YearSelector'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { setViewOnly, getTempAnswers } from 'Utilities/redux/formReducer'
import { formViewTranslations as translations } from 'Utilities/translations'
import { colors } from 'Utilities/common'
import questions from '../../questions'

const FormView = ({ room }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const lang = useSelector((state) => state.language)
  const deadline = useSelector((state) => state.deadlines.nextDeadline)

  const programme = useSelector((state) => state.studyProgrammes.singleProgram)
  const singleProgramPending = useSelector((state) => state.studyProgrammes.singleProgramPending)
  const user = useSelector((state) => state.currentUser.data)
  const year = useSelector(({ filters }) => filters.year)
  const viewingOldAnswers = useSelector((state) => state.form.viewingOldAnswers)
  const oldAnswers = useSelector((state) => state.oldAnswers.data)
  const currentRoom = useSelector((state) => state.room)
  const [showCsv, setShowCsv] = useState(false)

  const userHasWriteAccess = (user.access[room] && user.access[room].write) || user.admin
  const userHasReadAccess = (user.access[room] && user.access[room].read) || user.hasWideReadAccess

  const [loadObj, setLoadObj] = useState({
    loaded: false,
    loading: false,
  })

  useEffect(() => {
    dispatch(getProgramme(room))
    setLoadObj({
      loading: true,
      loaded: false,
    })
  }, [])

  useEffect(() => {
    document.title = `${translations['form'][lang]} - ${room}`
  }, [lang, room])

  useEffect(() => {
    if (loadObj.loading && !singleProgramPending) {
      setLoadObj({
        loaded: true,
        loading: false,
      })
    }

    if (!programme) return

    if (programme.locked || !userHasWriteAccess || viewingOldAnswers || !deadline) {
      dispatch(setViewOnly(true))
      if (currentRoom) dispatch(wsLeaveRoom(room))
      if (!viewingOldAnswers && deadline) {
        dispatch(getTempAnswers(room))
      }
      if (!viewingOldAnswers && !deadline && oldAnswers) {
        const programmesData = oldAnswers.find(
          (answer) => answer.programme === programme.key && answer.year === year
        )
        const answersFromSelectedYear = programmesData ? programmesData.data : []

        dispatch({
          type: 'SET_OLD_FORM_ANSWERS',
          answers: answersFromSelectedYear,
        })
      }
    } else {
      dispatch(wsJoinRoom(room))
      dispatch(setViewOnly(false))
    }

    if (viewingOldAnswers && oldAnswers) {
      const programmesData = oldAnswers.find(
        (answer) => answer.programme === programme.key && answer.year === year
      )
      const answersFromSelectedYear = programmesData ? programmesData.data : []

      dispatch({
        type: 'SET_OLD_FORM_ANSWERS',
        answers: answersFromSelectedYear,
      })
    }
  }, [singleProgramPending, viewingOldAnswers, year, deadline, oldAnswers])

  useEffect(() => {
    return () => {
      dispatch(wsLeaveRoom(room))
      dispatch({ type: 'RESET_STUDYPROGRAM_SUCCESS' })
    }
  }, [])

  if (!loadObj.loaded || loadObj.loading) return <Loader active />

  if (!room) return <Redirect to="/" />

  if (!programme) return 'Error: Invalid url.'

  if (!userHasReadAccess && !userHasWriteAccess) return <NoPermissions lang={lang} />

  const localizedProgramName = programme.name[lang] ? programme.name[lang] : programme.name['en']

  return (
    <div className="form-container">
      <NavigationSidebar programmeKey={programme.key} />
      <div className="the-form">
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <SaveIndicator />
            <div style={{ marginBottom: '2em' }}>
              <Button onClick={() => history.push('/')} icon="arrow left" />
            </div>
            <img className="img-responsive" src={rypsi_image} />
          </div>

          <h1 style={{ color: colors.blue }}>{localizedProgramName}</h1>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {translations.title[lang]} {year}
          </h3>

          <div className="hide-in-print-mode">
            <YearSelector size="extra-small" />
            <StatusMessage />
            <p>{translations.p1[lang]}</p>
            <p>{translations.p2[lang]}</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={positiveEmoji}
                style={{ width: '40px', height: 'auto', marginRight: '5px' }}
              />{' '}
              {translations.positive[lang]}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
              <img
                src={neutralEmoji}
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
                style={{ width: '40px', height: 'auto', marginRight: '5px' }}
              />{' '}
              {translations.negative[lang]}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2em' }}>
          <Dropdown
            className="button basic gray"
            direction="left"
            text={translations.csvDownload[lang]}
            onClick={() => setShowCsv(!showCsv)}
            data-cy="csv-download"
          >
            {showCsv ? (
              <Dropdown.Menu>
                <Dropdown.Item
                  content={<CsvDownload programme={programme} view="form" wantedData="written" />}
                />
                <Dropdown.Item
                  content={<CsvDownload programme={programme} view="form" wantedData="colors" />}
                />
              </Dropdown.Menu>
            ) : null}
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
