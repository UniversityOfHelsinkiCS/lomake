import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { Button, Icon } from 'semantic-ui-react'
import { isAdmin, requiredDegreeReformIds } from '@root/config/common'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import bigWheel from 'Assets/big_wheel.jpg'
import StatusMessage from 'Components/FormView/StatusMessage'

import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import {
  setViewOnly,
  getSingleUsersAnswers,
  postIndividualFormAnswer,
  getAllIndividualAnswersForUser,
  clearFormState,
} from 'Utilities/redux/formReducer'
import SaveIndicator from 'Components/FormView/SaveIndicator'
import SendFormModal from 'Components/Generic/SendFormModal'
import { degreeReformIndividualQuestions as questionData } from '../../../questionData'
import DegreeReformForm from './DegreeReformForm'

const formShouldBeViewOnly = ({ draftYear, year, formDeadline, formNumber }) => {
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  if (formDeadline?.form !== formNumber) return true
  return false
}

const DegreeReformIndividual = () => {
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const [modalOpen, setModalOpen] = useState(false)
  const { t } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const formData = useSelector(state => state.form)
  const [message, setMessage] = useState(null)
  const { uid } = user
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const formNumber = 3

  useEffect(() => {
    document.title = `${t('degree-reform-individual')}`
  }, [lang])

  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === formNumber) : null

  const year = 2023
  const currentRoom = useSelector(state => state.room)

  useEffect(() => {
    dispatch(getSingleUsersAnswers())
    dispatch(getAllIndividualAnswersForUser())
    if (formShouldBeViewOnly({ draftYear, year, formDeadline, formNumber })) {
      dispatch(setViewOnly(true))
      if (currentRoom) {
        dispatch(wsLeaveRoom(uid))
      }
    } else {
      dispatch(wsJoinRoom(uid, formNumber))
      dispatch(setViewOnly(false))
    }
  }, [year, draftYear, user, formDeadline, modalOpen, currentRoom])

  const handleSendingForm = async () => {
    if (!requiredDegreeReformIds.every(id => formData.data[id])) {
      setMessage(t('formView:fillAllRequiredFields'))
      setTimeout(() => setMessage(null), 10000)
      return
    }
    dispatch(postIndividualFormAnswer(formData.data))
    dispatch(clearFormState())
    setModalOpen(false)
  }

  if (!isAdmin(user)) return <Redirect to="/" />

  const formType = 'degree-reform-individual'
  return (
    <div className="form-container" data-cy="reform-individual-form-container" lang={lang}>
      <NavigationSidebar formType={formType} questionData={questionData} />
      <div className="the-form">
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <img alt="form-header-calendar" className="img-responsive" src={bigWheel} />
          </div>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('degree-reform')} 2015-2017 Testilomake
          </h3>
          <StatusMessage programme={user.id} form={formNumber} />
          <SaveIndicator />
        </div>
        <DegreeReformForm questionData={questionData} formType={formType} />
        <SendFormModal
          openButton={
            <Button
              style={{ maxWidth: '10em', marginTop: '1.5em' }}
              labelPosition="left"
              icon
              disabled={viewOnly}
              color="green"
            >
              <Icon name="upload" />
              {t('send')}
            </Button>
          }
          header="Koulutusuudistus lomakkeen lähetys"
          description="Lähetä lomake, voit tämän jälkeen lähettää uuden"
          sendButton={handleSendingForm}
          open={modalOpen}
          setOpen={setModalOpen}
          message={message}
        />
      </div>
    </div>
  )
}
export default DegreeReformIndividual
