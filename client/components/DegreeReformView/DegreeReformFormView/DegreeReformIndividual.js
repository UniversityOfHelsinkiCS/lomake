import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
// import { Redirect } from 'react-router'

// import { isAdmin } from '@root/config/common'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import bigWheel from 'Assets/big_wheel.jpg'

import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { setViewOnly, getSingleUsersAnswers } from 'Utilities/redux/formReducer'
import individualQuestionData from '../../../degreeReformIndividualQuestions.json'
import questionData from '../../../degreeReformQuestions.json'
import DegreeReformForm from './DegreeReformForm'

const formShouldBeViewOnly = ({ draftYear, year, formDeadline, formNumber }) => {
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  if (formDeadline?.form !== formNumber) return true
  return false
}

const DegreeReformIndividual = () => {
  const { t } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const { uid } = user
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const formNumber = 3

  // Not needed as it is, some other ways to check rights
  // const writeAccess = (user.access[formNumber] && user.access[formNumber].write) || isAdmin(user)
  // const readAccess = (user.access[formNumber] && user.access[formNumber].read) || isAdmin(user)

  // TO FIX
  useEffect(() => {
    document.title = `${t('degree-reform-individual')}`
  }, [lang])

  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === formNumber) : null

  const year = 2023
  const currentRoom = useSelector(state => state.room)

  useEffect(() => {
    dispatch(getSingleUsersAnswers())
    if (formShouldBeViewOnly({ draftYear, year, formDeadline, formNumber })) {
      dispatch(setViewOnly(true))
      if (currentRoom) {
        dispatch(wsLeaveRoom(uid))
      }
    } else {
      dispatch(wsJoinRoom(uid, formNumber))
      dispatch(setViewOnly(false))
    }
  }, [year, draftYear, user, formDeadline])

  // if (!isAdmin(user)) return <Redirect to="/" />

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
    <div className="form-container" data-cy="reform-individual-form-container">
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
