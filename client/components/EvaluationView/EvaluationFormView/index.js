import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Loader, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { isAdmin } from '@root/config/common'
import { colors } from 'Utilities/common'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { setViewOnly, getSingleProgrammesAnswers } from 'Utilities/redux/formReducer'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import NoPermissions from 'Components/Generic/NoPermissions'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import calendarImage from 'Assets/calendar.jpg'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import StatusMessage from 'Components/FormView/StatusMessage'
import SaveIndicator from 'Components/FormView/SaveIndicator'
import EvaluationForm from './EvaluationForm'

import questions from '../../../evaluationQuestions.json'
import yearlyQuestions from '../../../questions.json'

// TO FIX yearly and degree form uses same checker. refactor to common tools
const formShouldBeViewOnly = ({
  accessToTempAnswers,
  programme,
  writeAccess,
  viewingOldAnswers,
  draftYear,
  year,
  formDeadline,
  form,
}) => {
  if (!accessToTempAnswers) return true
  if (programme.locked) return true
  if (!writeAccess) return true
  if (viewingOldAnswers) return true
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  if (formDeadline?.form !== form) return true
  return false
}

const handleMeasures = (yearData, relatedQuestion) => {
  let count = 0
  let text = ''
  let i = 1
  while (i < 6) {
    if (yearData[`${relatedQuestion}_${i}_text`]) {
      text += `${i}) ${yearData[`${relatedQuestion}_${i}_text`]}\n`
      count = i
    }
    i++
  }

  return { text, light: null, count }
}

const findAnswers = (allOldAnswers, relatedQuestion) => {
  const years = [2021, 2022, 2023]
  const result = {}

  years.forEach(year => {
    const yearData = allOldAnswers.find(a => a.year === year)
    if (!yearData) {
      result[year] = { text: null, light: null }
      if (relatedQuestion.includes('measure')) {
        result[year].count = 0
      }
    } else if (relatedQuestion.includes('measure')) {
      result[year] = handleMeasures(yearData.data, relatedQuestion)
    } else {
      const text = yearData.data[`${relatedQuestion}_text`]
      const light = yearData.data[`${relatedQuestion}_light`]

      result[year] = { text, light }
    }
  })
  result.details = yearlyQuestions.flatMap(section => section.parts).find(part => part.id === relatedQuestion)
  return result
}

const EvaluationFormView = ({ room, formString }) => {
  const form = parseInt(formString, 10) || null
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)

  const programme = useSelector(state => state.studyProgrammes.singleProgram)
  const singleProgramPending = useSelector(state => state.studyProgrammes.singleProgramPending)

  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === form) : null
  const currentRoom = useSelector(state => state.room)
  const year = 2023 // the next time form is filled is in 2026
  const viewingOldAnswers = false // no old asnwers to watch

  const programmeYearlyAnswers = useSelector(state =>
    state.oldAnswers.data.filter(a => a.programme === room && a.form === 1)
  )

  const faculty = programme?.primaryFaculty?.code || ''
  const summaryURL = `/evaluation/previous-years/${room}`
  const oodiProgURL = `https://oodikone.helsinki.fi/evaluationoverview/programme/${room}`
  const oodiFacultyURL = `https://oodikone.helsinki.fi/evaluationoverview/faculty/${faculty}`

  const writeAccess = (user.access[room] && user.access[room].write) || isAdmin(user)
  const readAccess = (user.access[room] && user.access[room].read) || isAdmin(user)
  const accessToTempAnswers = user.yearsUserHasAccessTo.includes(year)

  useEffect(() => {
    document.title = `${t('evaluation')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  useEffect(() => {
    if (!programme || !form) return
    dispatch(getSingleProgrammesAnswers({ room, year, form }))
    if (
      formShouldBeViewOnly({
        accessToTempAnswers,
        programme,
        writeAccess,
        viewingOldAnswers,
        draftYear,
        year,
        formDeadline,
        form,
      })
    ) {
      dispatch(setViewOnly(true))
      if (currentRoom) dispatch(wsLeaveRoom(room))
    } else {
      dispatch(wsJoinRoom(room, form))
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

  // Find programme's yearly assessment data
  const yearlyAnswers = useMemo(() => {
    const result = {}
    questions.forEach(q => {
      q.parts.forEach(part => {
        if (part.relatedYearlyQuestions) {
          part.relatedYearlyQuestions.forEach(relatedQuestion => {
            if (result[part.id] === undefined) {
              result[part.id] = {}
            }
            result[part.id][relatedQuestion] = findAnswers(programmeYearlyAnswers, relatedQuestion)
          })
        }
      })
    })
    return result
  }, [room, user])

  // TO FIX To be removed
  if (!isAdmin(user)) return <Redirect to="/" />

  if (!room || !form) return <Redirect to="/" />

  if (!programme && !singleProgramPending) return 'Error: Invalid url.'

  if (!readAccess && !writeAccess) return <NoPermissions t={t} />

  return singleProgramPending ? (
    <Loader active />
  ) : (
    <div className="form-container">
      <NavigationSidebar programmeKey={room} formType="evaluation" formNumber={form} />
      <div className="the-form">
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <SaveIndicator />
            <div style={{ marginBottom: '2em' }}>
              <Button onClick={() => history.push('/evaluation')} icon="arrow left" />
            </div>
            <img alt="form-header-calendar" className="img-responsive" src={calendarImage} />
          </div>
          <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('evaluation')} 2023
          </h3>

          <div className="hide-in-print-mode">
            <StatusMessage programme={room} form={form} />
            <p>
              Katselmuksessa tarkastellaan koulutusohjelman tilannetta laajemmin <b>kolmen viime vuoden ajalta</b>.
            </p>
            <p>Keskustelkaa koulutusohjelman johtoryhmässä keskustelua seuraavista aiheista.</p>
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

          <div style={{ marginTop: '2em' }}>
            <h4 data-cy="formview-links">Taustamateriaali</h4>
            <p>Alla olevasta linkistä voitte tarkastella kootusti kaikkia vuosiseurannassa kirjattuja vastauksia.</p>
            <p>
              Lisäksi tässä lomakkeessa on kunkin kysymyksen yhteyteen lisätty tiivistelmä kolmelta viimeisimmältä
              vuodelta kyseiseen teemaan liityevien vuosiseurantakysymysten vastauksista.
            </p>
            <p>
              Oodikoneseen on luotu näkymä katselmoinnin tueksi. Tähän näkymään on kerätty keskeisimpiä tilastoja
              koulutusohjelmanne ja tiedekuntanne opiskelijoista ja heidän opintojensa etenemisestä. Alla linkki sekä
              koulutusohjelma- että tiedekuntatason näkymään.
            </p>
          </div>

          <div
            className="past-answers-link"
            style={{
              lineHeight: 2,
              backgroundColor: colors.background_blue,
              padding: '1.5em 0.5em',
              borderRadius: '5px',
              margin: '2em 0em 1em 0em',
            }}
          >
            <Link data-cy={`link-to-old-${room}-answers`} to={summaryURL} target="_blank">
              <h4 style={{ marginBottom: '0.5em' }}>
                Tarkastele kaikkia aiempien vuosiseurontojen vastauksia <Icon name="external" />{' '}
              </h4>
            </Link>
            <a href={oodiProgURL} data-cy={`link-to-oodikone-programme-${room}`} target="_blank" rel="noreferrer">
              <h4 style={{ marginBottom: '0.5em' }}>
                Tarkastele koulutusohjelman tietoja Oodikonessa <Icon name="external" />{' '}
              </h4>
            </a>
            <a href={oodiFacultyURL} data-cy={`link-to-oodikone-faculty-${room}`} target="_blank" rel="noreferrer">
              <h4>
                Tarkastele tiedekunnan tietoja Oodikonessa <Icon name="external" />{' '}
              </h4>
            </a>
          </div>
        </div>
        <EvaluationForm programmeKey={programme.key} questions={questions} yearlyAnswers={yearlyAnswers} form={form} />
      </div>
    </div>
  )
}

export default EvaluationFormView
