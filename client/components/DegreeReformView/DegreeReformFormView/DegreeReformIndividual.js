import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
// import { Redirect } from 'react-router'
import { Button, Icon } from 'semantic-ui-react'
// import { isAdmin } from '@root/config/common'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import bigWheel from 'Assets/big_wheel.jpg'

import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { setViewOnly, getSingleUsersAnswers } from 'Utilities/redux/formReducer'
import { degreeReformIndividualQuestions as questions } from '../../../questionData'
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

  const handleSendingForm = () => {
    // Send form to server
  }

  // if (!isAdmin(user)) return <Redirect to="/" />

  const formType = 'degree-reform-individual'
  return (
    <div className="form-container" data-cy="reform-individual-form-container">
      <NavigationSidebar formType={formType} />
      <div className="the-form">
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <img alt="form-header-calendar" className="img-responsive" src={bigWheel} />
          </div>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('degree-reform-individual')} 2015-2017
          </h3>
        </div>
        <DegreeReformForm questionData={questions} formType={formType} />
        <Button style={{ maxWidth: '10em', marginTop: '1.5em' }} icon color="green" onClick={handleSendingForm}>
          <Icon name="upload" />
          {t('send')}
        </Button>
      </div>
    </div>
  )
}
export default DegreeReformIndividual
