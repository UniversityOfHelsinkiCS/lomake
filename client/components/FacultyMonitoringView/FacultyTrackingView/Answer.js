import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { formKeys } from '@root/config/data'
import CustomModal from 'Components/Generic/CustomModal'
import { getTempAnswersByForm } from 'Utilities/redux/tempAnswersReducer'
import { getLockHttp, updateFormField } from 'Utilities/redux/formReducer'
import { deepCheck } from 'Components/Generic/Textarea'
import { releaseFieldLocally } from 'Utilities/redux/currentEditorsReducer'
import MonitoringQuestionForm from '../MonitoringQuestionForm/index'
import '../../Generic/Generic.scss'

const Answer = ({ question, faculty }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const form = formKeys.FACULTY_MONITORING
  const lang = useSelector(state => state.language)
  const answers = useSelector(state => state.tempAnswers.data)
  const [formModalData, setFormModalData] = useState(null)
  const facultyAnswers = useMemo(() => {
    return answers ? answers.find(answer => answer.programme === faculty)?.data || {} : {}
  }, [answers, faculty])
  const fieldName = `${question.id}_lights_history`
  const modalName = `${question.id}_modal`
  const dataFromRedux = useSelector(({ form }) => form.data)
  const lightsHistory = dataFromRedux[fieldName] || []
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const isEditable = !viewOnly
  const isDoctoral = useSelector(({ filters }) => filters.isDoctoral)

  // check if current user is the editor
  const currentEditors = useSelector(({ currentEditors }) => currentEditors.data, deepCheck)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const [hasLock, setHasLock] = useState(true)
  const [gettingLock, setGettingLock] = useState(false)
  const lockRef = useRef(gettingLock)
  lockRef.current = gettingLock

  const someoneElseHasTheLock =
    currentEditors && currentUser && currentEditors[modalName] && currentEditors[modalName].uid !== currentUser.uid

  useEffect(() => {
    const gotTheLock = currentEditors && currentEditors[modalName] && currentEditors[modalName].uid === currentUser.uid

    setHasLock(gotTheLock)

    if (gettingLock && currentEditors[fieldName]) {
      setGettingLock(false)
    }
  }, [currentEditors])

  const askForLock = () => {
    setGettingLock(true)
    dispatch(getLockHttp(modalName, faculty))
  }

  useEffect(() => {
    if (!hasLock) {
      dispatch(getTempAnswersByForm(form))
    }
  }, [dispatch, dataFromRedux, form, hasLock])

  const openFormModal = question => {
    askForLock()
    setFormModalData(question)
  }

  const closeFormModal = () => {
    dispatch(releaseFieldLocally(modalName))
    setFormModalData(null)
    dispatch(updateFormField(modalName, '', form))
  }

  useEffect(() => {
    let timer

    const resetTimer = () => {
      clearTimeout(timer)
      timer = setTimeout(closeFormModal, 2 * 60 * 1000) // timer is 2 minutes
    }

    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keypress', resetTimer)
    window.addEventListener('click', resetTimer)
    window.addEventListener('scroll', resetTimer)

    // Start the timer on mount
    resetTimer()

    // Cleanup function to remove event listeners and clear timer
    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('keypress', resetTimer)
      window.removeEventListener('click', resetTimer)
      window.removeEventListener('scroll', resetTimer)
    }
  }, [])

  const formatDate = date => {
    return new Date(date)
      .toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .split('/')
      .join('.')
  }

  if (!answers || answers.pending) {
    return null
  }

  const radioAnswer = `${facultyAnswers[`${question.id}_degree_radio`]}` || null
  const translationKey = `trackingPage:${radioAnswer}`
  const translationValue = t(translationKey)

  return (
    <>
      <h4>{`${question.id?.startsWith('T') ? question.id.slice(1) : question.id}. ${question.label[lang]}`}</h4>
      <div className="answer-container">
        <div>
          <div>
            <i>
              {`${t('trackingPage:selectDegree')}: `}
              {translationValue}
            </i>
          </div>
          <i>{t(`formView:monitoringTrackingLabel`)}</i>
          <div className="light-container">
            {lightsHistory.length > 0 ? (
              <>
                {lightsHistory.map((entry, index) => (
                  <div data-cy={`${entry.color}-${index}`} className="light" key={entry.date}>
                    <span className={`answer-circle-big-${entry.color}`} />
                    <div className="light-text">
                      <span>{t(`facultyTracking:${entry.color}`)}</span>
                      {'  '}
                      <span>{formatDate(entry.date)}</span>
                    </div>
                  </div>
                ))}
                {/* lightsHistory.length > 4 && (
                  <Button onClick={() => setShowAll(!showAll)} style={{ marginTop: '10px' }}>
                    {showAll ? t('common:showLess') : t('common:showAll')}
                  </Button>
                ) */}
              </>
            ) : (
              t('formView:noAnswer')
            )}
          </div>
        </div>
        {!isDoctoral && (
          <div className="single-row">
            <div>
              <i>{t(`facultyTracking:selectDegree`)}</i>
              <p>
                {facultyAnswers[`${question.id}_degree_radio`]
                  ? t(`facultyTracking:${facultyAnswers[`${question.id}_degree_radio`]}`)
                  : t('facultyTracking:both')}
              </p>
            </div>
          </div>
        )}
        {['actions', 'responsible_entities'].map(fieldName => {
          const labels = {
            actions: 'monitoringActionsLabel',
            responsible_entities: 'monitoringResponsibleLabel',
          }
          return (
            <div className="single-row" key={fieldName}>
              <div>
                <i>{t(`formView:${labels[fieldName]}`)}</i>
                <p>{facultyAnswers[`${question.id}_${fieldName}_text`] || t('formView:noAnswer')}</p>
              </div>
            </div>
          )
        })}
        <div className="two-column-row">
          {['contact_person', 'resources'].map(fieldName => {
            const labels = {
              contact_person: 'monitoringContactLabel',
              resources: 'monitoringResourceLabel',
            }
            return (
              <div key={fieldName} className="flex-item">
                <i>{t(`formView:${labels[fieldName]}`)}</i>
                <p>{facultyAnswers[`${question.id}_${fieldName}_text`] || t('formView:noAnswer')}</p>
              </div>
            )
          })}
        </div>
        <div className="two-column-row">
          {['start_date', 'end_date'].map(fieldName => {
            const labels = {
              start_date: 'monitoringStartLabel',
              end_date: 'monitoringEndLabel',
            }
            return (
              <div key={fieldName} className="flex-item">
                <i>{t(`formView:${labels[fieldName]}`)}</i>
                <p>
                  {facultyAnswers[`${question.id}_${fieldName}_text`]
                    ? formatDate(new Date(facultyAnswers[`${question.id}_${fieldName}_text`]))
                    : t('formView:noAnswer')}
                </p>
              </div>
            )
          })}
        </div>
        {isEditable && (
          <div className="button-container">
            {someoneElseHasTheLock && (
              <i
                style={{ color: 'gray', padding: '8px' }}
              >{`${currentEditors[modalName].firstname} ${currentEditors[modalName].lastname} ${t('generic:isWriting')}`}</i>
            )}
            <Button
              data-cy={`modify-plan-${question.id}`}
              disabled={someoneElseHasTheLock}
              onClick={() => openFormModal(question)}
              content={t('formView:modifyPlan')}
            />
          </div>
        )}
      </div>
      {formModalData && (
        <CustomModal
          closeModal={closeFormModal}
          title={`${formModalData.id?.startsWith('T') ? formModalData.id.slice(1) : formModalData.id}. ${formModalData.label[lang]}`}
        >
          <MonitoringQuestionForm question={formModalData} faculty={faculty} />
          <Button data-cy="send-form" secondary style={{ marginTop: '1em', float: 'right' }} onClick={closeFormModal}>
            {t('formView:sendForm')}
          </Button>
        </CustomModal>
      )}
    </>
  )
}

export default Answer
