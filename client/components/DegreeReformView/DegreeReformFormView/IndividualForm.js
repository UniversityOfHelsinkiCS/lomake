import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Dimmer, Segment, Header, Message } from 'semantic-ui-react'
import { requiredDegreeReformIds } from '@root/config/common'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import bigWheel from 'Assets/big_wheel.jpg'
import StatusMessage from 'Components/FormView/StatusMessage'

import { setViewOnly, updateIndividualReady, getSingleUsersAnswers } from 'Utilities/redux/formReducer'
import SaveIndicator from 'Components/FormView/SaveIndicator'
import { degreeReformIndividualQuestions as questionData } from '../../../questionData'
import DegreeReformForm from './ProgramForm'

const formShouldBeViewOnly = ({ draftYear, year, formDeadline, formNumber, ready }) => {
  if (!draftYear) return true
  if (draftYear && draftYear.year !== year) return true
  if (formDeadline?.form !== formNumber) return true
  if (ready) return true
  return false
}

const DegreeReformIndividual = () => {
  const viewOnly = useSelector(({ form }) => form.viewOnly)
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
    if (formData.pending) return
    dispatch(getSingleUsersAnswers())
    if (formShouldBeViewOnly({ draftYear, year, formDeadline, formNumber, ready: formData.data.ready })) {
      dispatch(setViewOnly(true))
    } else {
      dispatch(setViewOnly(false))
    }
  }, [year, draftYear, user, formDeadline, currentRoom])

  const handleFormReady = async () => {
    if (!requiredDegreeReformIds.every(id => formData.data[id])) {
      setMessage(t('formView:fillAllRequiredFields'))
      setTimeout(() => setMessage(null), 10000)
      return false
    }
    dispatch(updateIndividualReady({ uid, ready: true }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return true
  }

  const formType = 'degree-reform-individual'
  return (
    <div className="form-container" data-cy="reform-individual-form-container" lang={lang}>
      <NavigationSidebar formType={formType} questionData={questionData} />
      <Dimmer.Dimmable as={Segment} dimmed={formData.ready}>
        <Dimmer active={formData.ready} verticalAlign="top">
          <div style={{ marginTop: '5em' }}>
            <Header as="h2" inverted>
              {t('formView:formReady')}
            </Header>
            <Button
              primary
              onClick={() => {
                dispatch(updateIndividualReady({ uid, ready: false }))
              }}
            >
              {t('formView:modifyForm')}
            </Button>

            {/* <SendFormModal
              openButton={
                <Button disabled={viewOnly} data-cy="individual-form-send-modal-button">
                  {t('formView:sendNewForm')}
                </Button>
              }
              header={t('formView:sendFormModalHeader')}
              description={t('formView:sendFormModalDescription')}
              open={modalOpen}
              setOpen={setModalOpen}
              message={message}
              sendButton={handleSendingForm}
            /> */}
          </div>
        </Dimmer>

        <div className="the-form">
          <div className="form-instructions">
            <div className="hide-in-print-mode">
              <img alt="form-header-calendar" className="img-responsive" src={bigWheel} />
            </div>
            <h3 style={{ marginTop: 10, fontSize: 32, marginBottom: 30 }} data-cy="formview-title">
              {t('degree-reform')}
            </h3>
            <StatusMessage programme={user.id} form={formNumber} />
            <SaveIndicator />
          </div>
          <DegreeReformForm questionData={questionData} formType={formType} />
          <Button
            style={{ maxWidth: '80em', marginTop: '1.5em' }}
            labelPosition="left"
            data-cy="individual-form-ready-button"
            icon
            disabled={viewOnly}
            color="green"
            onClick={handleFormReady}
          >
            <Icon name="upload" />
            <span style={{ fontSize: '1.5em' }}>{t('formView:sendForm')}</span>
          </Button>
          <p style={{ fontSize: '15px', textAlign: 'center' }}>{t('formView:canChange')}</p>
          {message ? (
            <>
              <Message size="tiny" header={message} color="red" />
            </>
          ) : null}
        </div>
      </Dimmer.Dimmable>
    </div>
  )
}
export default DegreeReformIndividual
