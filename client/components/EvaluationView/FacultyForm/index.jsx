import React, { useEffect, useMemo, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Button, Icon, Loader } from 'semantic-ui-react'
import Downloads from '../..//FormView/Downloads'
import { useSelector, useDispatch } from 'react-redux'
// import { Link } from 'react-router-dom'

import { setViewOnly, getSingleProgrammesAnswers } from '../../../redux/formReducer'
import { getFacultyProgrammeAnswersAction } from '../../../redux/summaryReducer'
import { wsJoinRoom, wsLeaveRoom } from '../../../redux/websocketReducer'
import NavigationSidebar from '../..//FormView/NavigationSidebar'
import StatusMessage from '../..//FormView/StatusMessage'
import SaveIndicator from '../..//FormView/SaveIndicator'

import postItImage from '../../../assets/post_it.jpg'
import './EvaluationFacultyForm.scss'
import { colors, getYearToShow, isAdmin, isKatselmusProjektiOrOhjausryhma } from '../../../util/common'
import NoPermissions from '../..//Generic/NoPermissions'
import { setYear } from '../../../redux/filterReducer'
import EvaluationForm from '../EvaluationFormView/EvaluationForm'

import { facultyEvaluationQuestions as questions, evaluationQuestions } from '../../../questionData'
import { useGetAuthUserQuery } from '@/client/redux/auth'

const formShouldBeViewOnly = ({ draftYear, year, formDeadline, writeAccess, form }) => {
  // This is used since faculty doesn't have stuyprogramme
  const isDraftYearInvalid = !draftYear || (draftYear && draftYear.year !== year)
  const isFormDeadlineInvalid = formDeadline?.form !== form
  const isWriteAccessInvalid = !writeAccess

  return isDraftYearInvalid || isFormDeadlineInvalid || isWriteAccessInvalid
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
  const componentRef = useRef()
  const lang = useSelector(state => state.language)
  const user = useGetAuthUserQuery()
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const currentRoom = useSelector(state => state.room)

  const faculties = useSelector(state => state.faculties.data)
  const faculty = faculties ? faculties.find(f => f.code === room) : null
  const singleFacultyPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const facultyProgrammeData = useSelector(state => state.summaries)

  const oodiFacultyURL = `https://oodikone.helsinki.fi/evaluationoverview/faculty/${room}`
  const degreeReformUrl = `/degree-reform?faculty=${room}`

  const formDeadline = nextDeadline ? nextDeadline.find(dl => dl.form === form) : null

  const year = getYearToShow({ draftYear, nextDeadline, form })

  const hasReadRights =
    user.access[faculty.code] ||
    isAdmin(user) ||
    user.specialGroup.evaluationFaculty ||
    isKatselmusProjektiOrOhjausryhma(user) ||
    Object.keys(user.access).length > 0
  const hasWriteRights = (user.access[faculty.code]?.write && user.specialGroup?.evaluationFaculty) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('evaluation')} - ${room}`
    dispatch(setYear(year))
  }, [lang, room, year])

  useEffect(() => {
    if (!faculty || !form) return
    if (!hasReadRights) {
      return
    }
    dispatch(getSingleProgrammesAnswers({ room, year, form }))
    dispatch(getFacultyProgrammeAnswersAction(room, lang))
    if (
      formShouldBeViewOnly({
        draftYear,
        year,
        formDeadline,
        form,
        writeAccess: hasWriteRights,
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

  if (!hasReadRights) {
    return <NoPermissions t={t} requestedForm={t('evaluation')} />
  }

  return (
    <div>
      {singleFacultyPending ? (
        <Loader active />
      ) : (
        <div className="form-container">
          <NavigationSidebar programmeKey={room} formType="evaluation" formNumber={form} />
          <div className="the-form" ref={componentRef}>
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
                {t('evaluation')} {year}
              </h3>

              <div className="hide-in-print-mode">
                <StatusMessage form={form} writeAccess={hasWriteRights} />
                <div className="info-container">
                  <p>
                    <Trans i18nKey="formView:facultyInfo" />
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
                  <Trans i18nKey="formView:materialsFaculty" />
                </p>
              </div>

              <div className="info-container">
                <a href={oodiFacultyURL} data-cy={`link-to-oodikone-faculty-${room}`} target="_blank" rel="noreferrer">
                  <h4>
                    {t('formView:oodikoneFaculty')} <Icon name="external" />{' '}
                  </h4>
                </a>
                <Link data-cy="link-to-old-answers" to={degreeReformUrl} target="_blank">
                  <h4 style={{ fontSize: '15px', marginTop: '1em', marginBottom: '1em' }}>
                    {t('formView:evaluationSummaryByProgramme')} <Icon name="external" />{' '}
                  </h4>
                </Link>
              </div>
            </div>
            <Downloads programme={faculty} componentRef={componentRef} form={form} />
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
