import React, { useEffect, useMemo } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Button, Icon, Loader } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
// import { Link } from 'react-router-dom'

import { setViewOnly, getSingleProgrammesAnswers } from 'Utilities/redux/formReducer'
import { getFacultyProgrammeAnswersAction } from 'Utilities/redux/summaryReducer'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import StatusMessage from 'Components/FormView/StatusMessage'
import SaveIndicator from 'Components/FormView/SaveIndicator'

import postItImage from 'Assets/post_it.jpg'
import './EvaluationForm.scss'
import { colors } from 'Utilities/common'
import EvaluationForm from '../EvaluationFormView/EvaluationForm'

import { facultyEvaluationQuestions as questions, evaluationQuestions } from '../../../questionData'

const formShouldBeViewOnly = ({ draftYear, year, formDeadline, form }) => {
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  if (formDeadline?.form !== form) return true
  return false
}

const findEntityLevelAnswers = (programmes, allAnswers, question) => {
  const result = {
    bachelor: { green: [], yellow: [], red: [], gray: [], text: [] },
    master: { green: [], yellow: [], red: [], gray: [], text: [] },
    doctoral: { green: [], yellow: [], red: [], gray: [], text: [] },
  }
  programmes.forEach(({ key, level, name }) => {
    const answer = allAnswers.find(a => a.programme === key)
    const light = answer?.data ? answer.data[`${question}_light`] : null
    const text = answer?.data ? answer.data[`${question}_text`] : null

    if (light) {
      result[level][light].push({ name, key })
    } else {
      result[level].gray.push({ name, key })
    }
    if (text) {
      result[level].text[key] = text
    }
  })
  result.details = evaluationQuestions.flatMap(section => section.parts).find(part => part.id === question)

  return result
}

const findActionAnswers = (programmes, allAnswers, question) => {
  const result = {
    bachelor: [],
    master: [],
    doctoral: [],
  }
  programmes.forEach(({ key, level, name }) => {
    const answer = allAnswers.find(a => a.programme === key)
    const text = []
    const actionNumbers = [1, 2, 3, 4, 5]

    actionNumbers.map((number, index) => {
      if (answer?.data && answer.data[`${question}-${number}-text`]) {
        text[index] = {
          title: answer.data[`${question}-${number}-text`].title,
          content: answer.data[`${question}-${number}-text`].actions,
        }
        return true
      }
      return false
    })
    if (text.length > 0) {
      result[level][key] = { text, programme: name }
    }
  })
  result.details = evaluationQuestions.flatMap(section => section.parts).find(part => part.id === question)
  return result
}

const findTextAnswers = (programmes, allAnswers, question) => {
  const result = {
    bachelor: [],
    master: [],
    doctoral: [],
  }

  programmes.forEach(({ key, level, name }) => {
    const text = []
    const answer = allAnswers.find(a => a.programme === key)
    // console.log(answer?.data[`${question}_text`])
    const answerText = answer?.data[`${question}_text`]
    if (answerText) {
      text.push({
        title: '',
        content: answerText,
      })
    }

    if (text.length > 0) {
      result[level][key] = {
        programme: name,
        text,
      }
    }
  })

  return result
}

const FacultyFormView = ({ room, formString }) => {
  const history = useHistory()
  const form = parseInt(formString, 10) || null
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === form) : null
  const currentRoom = useSelector(state => state.room)
  const year = 2023 // the next time form is filled is in 2026

  const faculties = useSelector(state => state.faculties.data)
  const faculty = faculties ? faculties.find(f => f.code === room) : null
  const singleFacultyPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const facultyProgrammeData = useSelector(state => state.summaries)

  const summaryURL = `/evaluation-faculty/previous-years/${room}`
  const oodiFacultyURL = `https://oodikone.helsinki.fi/evaluationoverview/faculty/${room}`
  const evaluationSummaryURL = `/evaluation-faculty/programme-evaluation-summary/${room}`

  useEffect(() => {
    document.title = `${t('evaluation')} - ${room}`
  }, [lang, room])

  useEffect(() => {
    if (!faculty || !form) return
    dispatch(getSingleProgrammesAnswers({ room, year, form }))
    dispatch(getFacultyProgrammeAnswersAction(room, lang))
    if (
      formShouldBeViewOnly({
        draftYear,
        year,
        formDeadline,
        form,
        user,
      })
    ) {
      dispatch(setViewOnly(true))
      if (currentRoom) dispatch(wsLeaveRoom(room))
    } else {
      dispatch(wsJoinRoom(room, form))
      dispatch(setViewOnly(false))
    }
  }, [
    faculty,
    singleFacultyPending,
    // writeAccess,
    // viewingOldAnswers,
    draftYear,
    // accessToTempAnswers,
    // readAccess,
    room,
    user,
  ])

  const facultyProgrammeAnswers = useMemo(() => {
    if (
      !facultyProgrammeData?.forFaculty ||
      facultyProgrammeData?.forFaculty?.answers.length === 0 ||
      facultyProgrammeData.pending
    ) {
      return {}
    }
    const { programmes, answers } = facultyProgrammeData?.forFaculty || {}
    const result = {}
    questions.forEach(q => {
      q.parts.forEach(part => {
        if (part.relatedEvaluationQuestion && part.type === 'ACTIONS') {
          result[part.id] = findActionAnswers(programmes, answers, part.relatedEvaluationQuestion)
          return
        }
        if (part.relatedEvaluationQuestion && part.type === 'ENTITY_LEVELS') {
          result[part.id] = findEntityLevelAnswers(programmes, answers, part.relatedEvaluationQuestion)
          return
        }
        if (part.relatedEvaluationQuestion && part.type === 'TEXTAREA') {
          result[part.id] = findTextAnswers(programmes, answers, part.relatedEvaluationQuestion)
        }
      })
    })
    return result
  }, [room, user, facultyProgrammeData.pending])

  if (!room || !form) return <Redirect to="/" />

  if (!faculty) return 'Error: Invalid url.'

  return (
    <div>
      {singleFacultyPending ? (
        <Loader active />
      ) : (
        <div className="form-container">
          <NavigationSidebar programmeKey={room} formType="evaluation" formNumber={form} />
          <div className="the-form">
            <div className="form-instructions">
              <div className="hide-in-print-mode">
                <SaveIndicator />
                <div style={{ marginBottom: '2em' }}>
                  <Button onClick={() => history.push('/evaluation-faculty')} icon="arrow left" />
                </div>
                <img alt="form-header-calendar" className="img-responsive" src={postItImage} />
              </div>
              <h1 style={{ color: colors.blue }}>{faculty?.name[lang]}</h1>
              <h3 style={{ marginTop: '0' }} data-cy="formview-title">
                {t('evaluation')} 2023
              </h3>

              <div className="hide-in-print-mode">
                <StatusMessage programme={room} form={form} />
                <div className="info-container">
                  <p>
                    <Trans i18nKey="formView:facultyInfo" />
                  </p>
                </div>
                <p>{t('formView:info2')}</p>
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
                  <Trans i18nKey="formView:materialsFaculty" />
                </p>
              </div>

              <div className="info-container">
                <a href={oodiFacultyURL} data-cy={`link-to-oodikone-faculty-${room}`} target="_blank" rel="noreferrer">
                  <h4>
                    {t('formView:oodikoneFaculty')} <Icon name="external" />{' '}
                  </h4>
                </a>
                <Link data-cy="link-to-old-answers" to={evaluationSummaryURL} target="_blank">
                  <h4 style={{ fontSize: '15px', marginTop: '1em', marginBottom: '1em' }}>
                    {t('formView:evaluationSummaryByProgramme')} <Icon name="external" />{' '}
                  </h4>
                </Link>
                <Link data-cy="link-to-old-answers" to={summaryURL} target="_blank">
                  <h4 style={{ fontSize: '15px', marginTop: '1em', marginBottom: '1em' }}>
                    {t('formView:allYearlyAnswerYears')}
                  </h4>
                </Link>
              </div>
            </div>
            <div style={{ paddingBottom: '6em' }}>
              <EvaluationForm
                programmeKey={faculty.code}
                questions={questions}
                form={form}
                summaryData={facultyProgrammeAnswers}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacultyFormView
