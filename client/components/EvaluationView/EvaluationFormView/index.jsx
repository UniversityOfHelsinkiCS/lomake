/* eslint-disable react/no-danger */
import React, { useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Loader, Icon } from 'semantic-ui-react'
import { useTranslation, Trans } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import Downloads from '../../FormView/Downloads'

import { hasSomeReadAccess, isAdmin } from '../../../../config/common'
import { colors, getFormViewRights, getYearToShow } from '../../../util/common'
import { getProgramme } from '../../../redux/studyProgrammesReducer'
import { setViewOnly, getSingleProgrammesAnswers } from '../../../redux/formReducer'
import { getProgrammeOldAnswersAction } from '../../../redux/summaryReducer'
import { wsJoinRoom, wsLeaveRoom } from '../../../redux/websocketReducer'
import NoPermissions from '../../Generic/NoPermissions'
import NavigationSidebar from '../../FormView/NavigationSidebar'
import calendarImage from '../../../assets/calendar.jpg'
import StatusMessage from '../../FormView/StatusMessage'
import SaveIndicator from '../../FormView/SaveIndicator'
import { setYear } from '../../../redux/filterReducer'
import EvaluationForm from './EvaluationForm'

import { evaluationQuestions as questions, yearlyQuestions } from '../../../questionData'

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
  const years = [2021, 2022, 2023, 2024]
  const result = {}
  const validOldAnswers = allOldAnswers.filter(a => a !== null)
  years.forEach(year => {
    const yearData = validOldAnswers.find(a => a.year === year)
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
  const componentRef = useRef()
  const programme = useSelector(state => state.studyProgrammes.singleProgram)
  const singleProgramPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const currentRoom = useSelector(state => state.room)
  const viewingOldAnswers = false // no old asnwers to watch
  const summaries = useSelector(state => state.summaries)

  const formDeadline = nextDeadline && Array.isArray(nextDeadline) ? nextDeadline.find(dl => dl.form === form) : null

  const year = getYearToShow({ draftYear, nextDeadline, form }) || new Date().getFullYear()

  const faculty = programme?.primaryFaculty?.code || ''
  const summaryURL = `/evaluation/previous-years/${room}`
  const oodiProgURL = `https://oodikone.helsinki.fi/evaluationoverview/programme/${room}`
  const oodiFacultyURL = `https://oodikone.helsinki.fi/evaluationoverview/faculty/${faculty}`
  const rapoLink = `https://rapocloud.it.helsinki.fi/analytics/saw.dll?Dashboard&PortalPath=%2Fshared%2FHelsingin%20yliopiston%20dashboardit%2F_portal%2FTohtorikoulutus&Page=Tohtoriohjelman%20vuosiseuranta%20%2F%20Annual%20review%20by%20doctoral%20programme`
  const writeAccess = (user.access[room] && user.access[room].write) || isAdmin(user)
  const readAccess = hasSomeReadAccess(user) || isAdmin(user)
  const accessToTempAnswers = user.yearsUserHasAccessTo.includes(year)

  useEffect(() => {
    document.title = `${t('evaluation')} - ${room}`
    dispatch(getProgramme(room))
    dispatch(setYear(year))
  }, [lang, room, year])

  useEffect(() => {
    if (!programme || !form) return
    dispatch(getSingleProgrammesAnswers({ room, year, form }))
    dispatch(getProgrammeOldAnswersAction(room))
    if (
      getFormViewRights({
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
    if (!summaries.forProgramme || summaries.forProgramme.length === 0 || summaries.pending) {
      return {}
    }
    const result = {}
    questions.forEach(q => {
      q.parts.forEach(part => {
        if (part.relatedYearlyQuestions) {
          part.relatedYearlyQuestions.forEach(relatedQuestion => {
            if (result[part.id] === undefined) {
              result[part.id] = {}
            }
            result[part.id][relatedQuestion] = findAnswers(summaries.forProgramme, relatedQuestion)
          })
        }
      })
    })
    return result
  }, [room, user, summaries])

  if (!room || !form) return <Redirect to="/" />

  if (!programme && !singleProgramPending) return 'Error: Invalid url.'

  if (!readAccess && !writeAccess) return <NoPermissions t={t} requestedForm={t('evaluation')} />

  return singleProgramPending ? (
    <Loader active />
  ) : (
    <div className="form-container">
      <NavigationSidebar programmeKey={room} formType="evaluation" formNumber={form} />
      <div className="the-form" ref={componentRef}>
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
            {t('evaluation')} {year}
          </h3>

          <div className="hide-in-print-mode">
            <StatusMessage form={form} writeAccess={writeAccess} />
            <div
              style={{
                lineHeight: 2,
                backgroundColor: colors.background_blue,
                padding: '1.5em 0.5em',
                borderRadius: '5px',
                margin: '2em 0em 1em 0em',
              }}
            >
              <p>
                <Trans i18nKey="formView:evaluationInfo1" />
              </p>
              <p>
                <Trans i18nKey="formView:evaluationInfo2" />
              </p>
            </div>
            <p style={{ marginBottom: '10px' }}>{t('formView:info2')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="big-circle-green" />
            {t('positive')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="big-circle-yellow" />
            {t('neutral')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="big-circle-red" />
            {t('negative')}
          </div>

          <div style={{ marginTop: '2em' }}>
            <h4 data-cy="formview-links">{t('formView:materials')}</h4>
            <p>
              <Trans i18nKey="formView:materialsProg" />
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
                {t('formView:summaryLinkProg')} <Icon name="external" />{' '}
              </h4>
            </Link>
            {!room.startsWith('T') && (
              <>
                <a href={oodiProgURL} data-cy={`link-to-oodikone-programme-${room}`} target="_blank" rel="noreferrer">
                  <h4 style={{ marginBottom: '0.5em' }}>
                    {t('formView:oodikoneProg')} <Icon name="external" />{' '}
                  </h4>
                </a>
                <a href={oodiFacultyURL} data-cy={`link-to-oodikone-faculty-${room}`} target="_blank" rel="noreferrer">
                  <h4>
                    {t('formView:oodikoneFaculty')} <Icon name="external" />{' '}
                  </h4>
                </a>
              </>
            )}
            {room.startsWith('T') ? (
              <div style={{ marginTop: '1em' }}>
                <a href={rapoLink} data-cy={`link-to-rapo-${room}`} target="_blank" rel="noreferrer">
                  <h4>
                    {t('formView:rapo')} <Icon name="external" />{' '}
                  </h4>
                </a>
              </div>
            ) : null}
            <div style={{ marginTop: '1em' }}>
              <h4 dangerouslySetInnerHTML={{ __html: t('formView:langCenterRaport') }} />
            </div>
            <div style={{ marginTop: '1em' }}>
              <h4 dangerouslySetInnerHTML={{ __html: t('formView:toijo') }} />
            </div>
          </div>
        </div>
        <div style={{ paddingBottom: '6em' }}>
          <Downloads programme={programme} componentRef={componentRef} form={form} />

          <EvaluationForm
            programmeKey={programme.key}
            questions={questions}
            summaryData={yearlyAnswers}
            form={form}
            summaryUrl={summaryURL}
          />
        </div>
      </div>
    </div>
  )
}

export default EvaluationFormView
