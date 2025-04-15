import React, { useEffect, useMemo, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Button, Icon, Loader } from 'semantic-ui-react'
import Downloads from '../../FormView/Downloads'
import { useSelector, useDispatch } from 'react-redux'
// import { Link } from 'react-router-dom'

import { setViewOnly, getSingleProgrammesAnswers, getCommitteeAnswers } from '../../../util/redux/formReducer'
import { getCommitteeFacultyAnswersAction } from '../../../util/redux/summaryReducer'
import { wsJoinRoom, wsLeaveRoom } from '../../../util/redux/websocketReducer'
import NavigationSidebar from '../../FormView/NavigationSidebar'
import StatusMessage from '../../FormView/StatusMessage'
import SaveIndicator from '../../FormView/SaveIndicator'

import postItImage from '../../../assets/post_it.jpg'
import './index.scss'
import { colors, getYearToShow, isEvaluationUniversityUser } from '../../../util/common'
import NoPermissions from '../../Generic/NoPermissions'
import { setYear } from '../../../util/redux/filterReducer'
import EvaluationForm from '../EvaluationFormView/EvaluationForm'

import { universityEvaluationQuestions as questions, evaluationQuestions } from '../../../questionData'
import { committeeList } from '../../../../config/data'

const formShouldBeViewOnly = ({ draftYear, year, formDeadline, writeAccess, form }) => {
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  if (formDeadline?.form !== form) return true
  if (!writeAccess) return true

  return false
}

const hasRights = currentUser => {
  return isEvaluationUniversityUser(currentUser)
}

const findEntityLevelAnswers = (faculties, allAnswers, question) => {
  const result = {
    bachelor: { green: [], yellow: [], red: [], gray: [], text: [] },
    master: { green: [], yellow: [], red: [], gray: [], text: [] },
    doctoral: { green: [], yellow: [], red: [], gray: [], text: [] },
  }
  const levels = ['bachelor', 'master', 'doctoral']

  faculties.forEach(({ code, name }) => {
    const answer = allAnswers.find(a => a.programme === code)
    levels.forEach(level => {
      const light = answer?.data ? answer.data[`${question}_${level}_light`] : null
      const text = answer?.data ? answer.data[`${question}_text`] : null
      const key = code
      if (light) {
        result[level][light].push({ name, key })
      } else {
        result[level].gray.push({ name, key })
      }
      if (text) {
        result[level].text[key] = text
      }
    })
  })
  result.details = evaluationQuestions.flatMap(section => section.parts).find(part => part.id === question)

  return result
}

const findActionAnswers = (faculties, allAnswers, question) => {
  const result = {
    faculty: [],
  }
  faculties.forEach(({ code, name }) => {
    const answer = allAnswers.find(a => a.programme === code)
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
      result.faculty[code] = { text, programme: name }
    }
  })
  result.details = evaluationQuestions.flatMap(section => section.parts).find(part => part.id === question)
  return result
}

const findTextAnswers = (faculties, allAnswers, question) => {
  const result = {
    faculty: [],
  }
  faculties.forEach(({ code, name }) => {
    const text = []
    const answer = allAnswers.find(a => a.programme === code)
    const answerText = answer?.data[`${question}_text`]
    if (answerText) {
      text.push({
        title: '',
        content: answerText,
      })
    }

    if (text.length > 0) {
      result.faculty[code] = {
        programme: name,
        text,
      }
    }
  })
  return result
}

const CommitteeFormView = ({ room, formString }) => {
  const history = useHistory()
  const form = parseInt(formString, 10) || null
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const componentRef = useRef()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const currentRoom = useSelector(state => state.room)

  const formDeadline = nextDeadline ? nextDeadline.find(dl => dl.form === form) : null

  const year = getYearToShow({ draftYear, nextDeadline, form })

  const committee = committeeList.find(c => c.code === room) || null
  const singleFacultyPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const facultyProgrammeData = useSelector(state => state.summaries)

  const oodikoneURL = `https://oodikone.helsinki.fi/evaluationoverview/university`
  const degreeReformUrl = `/degree-reform?faculty=${room}`

  useEffect(() => {
    document.title = `${t('evaluation')} - ${room}`
    dispatch(setYear(year))
  }, [lang, room, year])

  const viewOnly = formShouldBeViewOnly({
    draftYear,
    year,
    formDeadline,
    writeAccess: hasRights(user),
    form,
  })

  useEffect(() => {
    if (!committee || !form) return
    if (!hasRights(user)) {
      return
    }
    dispatch(getSingleProgrammesAnswers({ room, year, form }))
    dispatch(getCommitteeFacultyAnswersAction(room, lang))
    if (viewOnly) {
      dispatch(setViewOnly(true))
      if (currentRoom) dispatch(wsLeaveRoom(room))
    } else {
      dispatch(wsJoinRoom(room, form))
      dispatch(setViewOnly(false))
    }
  }, [committee, singleFacultyPending, draftYear, room, user])

  useEffect(() => {
    if (window.location.href.match('((/UNI_EN)|(/UNI_SE))') && year) {
      dispatch(getCommitteeAnswers({ year }))
    }
  }, [year])

  const facultyAnswers = useMemo(() => {
    if (
      !facultyProgrammeData?.forCommittee ||
      facultyProgrammeData?.forCommittee?.answers.length === 0 ||
      facultyProgrammeData.pending
    ) {
      return {}
    }
    const { faculties, answers } = facultyProgrammeData?.forCommittee || {}
    const result = {}
    questions.forEach(q => {
      q.parts.forEach(part => {
        if (part.relatedEvaluationQuestion && part.type === 'ACTIONS_UNIVERSITY') {
          result[part.id] = findActionAnswers(faculties, answers, part.relatedEvaluationQuestion)
          return
        }
        if (part.relatedEvaluationQuestion && part.type === 'ACTIONS') {
          result[part.id] = findActionAnswers(faculties, answers, part.relatedEvaluationQuestion)
          return
        }
        if (part.relatedEvaluationQuestion && part.type === 'ENTITY_LEVELS') {
          result[part.id] = findEntityLevelAnswers(faculties, answers, part.relatedEvaluationQuestion)
          return
        }
        if (part.relatedEvaluationQuestion && part.type === 'ENTITY_UNIVERSITY') {
          result[part.id] = findEntityLevelAnswers(faculties, answers, part.relatedEvaluationQuestion)
          return
        }
        if (part.relatedEvaluationQuestion && part.type === 'TEXTAREA') {
          result[part.id] = findTextAnswers(faculties, answers, part.relatedEvaluationQuestion)
        }
        if (part.relatedEvaluationQuestion && part.type === 'TEXTAREA_UNIVERSITY') {
          result[part.id] = findTextAnswers(faculties, answers, part.relatedEvaluationQuestion)
        }
      })
    })
    return result
  }, [room, user, facultyProgrammeData.pending])
  if (!room || !form) return <Redirect to="/" />
  if (!committee) return 'Error: Invalid url.'
  if (!user.access[committee.code] && !hasRights(user)) {
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
                  <Button onClick={() => history.push('/evaluation-university')} icon="arrow left" />
                </div>
                <img alt="form-header-calendar" className="img-responsive" src={postItImage} />
              </div>
              <h1 style={{ color: colors.blue }}>{committee?.name[lang]}</h1>
              <h3 style={{ marginTop: '0' }} data-cy="formview-title">
                {t('evaluation')} {year}
              </h3>

              <div className="hide-in-print-mode">
                <div className="info-container">
                  <p>
                    <Trans i18nKey="formView:evaluationUniTopInfo" />
                  </p>
                </div>
              </div>

              <div className="hide-in-print-mode">
                <StatusMessage form={form} writeAccess={hasRights} />
                <h4>
                  <Trans i18nKey="formView:evaluationInfoUni" />
                </h4>
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
                  <Trans i18nKey="formView:materialsUniversity" />
                </p>
              </div>

              <div className="info-container">
                <a href={oodikoneURL} data-cy={`link-to-oodikone-faculty-${room}`} target="_blank" rel="noreferrer">
                  <h4>
                    {t('formView:oodikoneUniversity')} <Icon name="external" />{' '}
                  </h4>
                </a>
                <Link data-cy="link-to-old-answers" to={degreeReformUrl} target="_blank">
                  <h4 style={{ fontSize: '15px', marginTop: '1em', marginBottom: '1em' }}>
                    {t('formView:evaluationSummaryUniversity')} <Icon name="external" />{' '}
                  </h4>
                </Link>
              </div>
            </div>
            <Downloads programme={committee} componentRef={componentRef} form={form} />
            <div id="university-form" style={{ paddingBottom: '6em' }}>
              <EvaluationForm
                key={lang}
                programmeKey={committee.code}
                questions={questions}
                form={form}
                summaryData={facultyAnswers}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommitteeFormView
