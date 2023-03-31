import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'

import { isAdmin } from '@root/config/common'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import bigWheel from 'Assets/big_wheel.jpg'

import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { setViewOnly, getSingleProgrammesAnswers } from 'Utilities/redux/formReducer'
import { getPreviousAnswersAction } from 'Utilities/redux/previousAnswersReducer'
import individualQuestionData from '../../../degreeReformIndividualQuestions.json'
import questionData from '../../../degreeReformQuestions.json'
import DegreeReformForm from './DegreeReformForm'

const formShouldBeViewOnly = ({ accessToTempAnswers, writeAccess, viewingOldAnswers, draftYear, year }) => {
  if (!accessToTempAnswers) return true
  if (!writeAccess) return true
  if (viewingOldAnswers) return true
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  return false
}

const DegreeReformIndividual = () => {
  const { t } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const formNumber = 3
  useEffect(() => {
    dispatch(getPreviousAnswersAction(3))
  }, [])

  const writeAccess = (user.access[formNumber] && user.access[formNumber].write) || isAdmin(user)
  const readAccess = (user.access[formNumber] && user.access[formNumber].read) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('degree-reform')}`
    dispatch(getProgramme(formNumber))
  }, [lang])

  const draftYear = useSelector(state => state.deadlines.draftYear)
  const singleProgramPending = useSelector(state => state.studyProgrammes.singleProgramPending)
  const year = 2023
  const viewingOldAnswers = useSelector(state => state.form.viewingOldAnswers)
  const currentRoom = useSelector(state => state.room)

  const accessToTempAnswers = user.yearsUserHasAccessTo.includes(year)

  useEffect(() => {
    document.title = `${t('form')}`
    dispatch(getProgramme(formNumber))
  }, [lang])

  useEffect(() => {
    dispatch(getSingleProgrammesAnswers({ year, formNumber }))
    if (formShouldBeViewOnly({ accessToTempAnswers, writeAccess, viewingOldAnswers, draftYear, year })) {
      dispatch(setViewOnly(true))
      if (currentRoom) {
        dispatch(wsLeaveRoom(formNumber))
      }
    } else {
      dispatch(wsJoinRoom(formNumber))
      dispatch(setViewOnly(false))
    }
  }, [singleProgramPending, writeAccess, viewingOldAnswers, year, draftYear, accessToTempAnswers, readAccess, user])

  if (!isAdmin(user)) return <Redirect to="/" />

  const formType = 'degree-reform-individual'

  const questions = questionData.map(q => {
    if (q.id === 0 && q.parts.length === 1) {
      const individualSubarray = individualQuestionData.slice(0, 2)
      const lastInfobox = individualQuestionData.slice(2, 3)
      q.parts = individualSubarray.concat(q.parts)
      q.parts = q.parts.concat(lastInfobox)
      return q
    }
    return q
  })

  return (
    <div className="form-container">
      <NavigationSidebar formType={formType} />
      <div className="the-form">
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <img alt="form-header-calendar" className="img-responsive" src={bigWheel} />
          </div>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('degree-reform-individual')} 2023
          </h3>
        </div>
        <DegreeReformForm questionData={questions} formType={formType} />
      </div>
    </div>
  )
}
export default DegreeReformIndividual
