/* eslint-disable camelcase */
import { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formKeys } from '../../../../config/data'
import CustomModal from '../../Generic/CustomModal'
import { getTempAnswersByForm } from '../../../redux/tempAnswersReducer'
import { updateFormField } from '../../../redux/formReducer'
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
    return answers?.find(answer => answer.programme === faculty)?.data ?? {}
  }, [answers, faculty])
  const fieldName = `${question.id}_lights_history`
  const modalName = `${question.id}_modal`
  const dataFromRedux = useSelector(({ form }) => form.data)
  const lightsHistory = dataFromRedux[fieldName] ?? []

  const isDoctoral = useSelector(({ filters }) => filters.isDoctoral)

  useEffect(() => {
    dispatch(getTempAnswersByForm(form))
  }, [dispatch, dataFromRedux, form])

  const closeFormModal = () => {
    setFormModalData(null)
    dispatch(updateFormField(modalName, '', form))
  }

  const formatDate = date => {
    return new Date(date)
      .toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .split('/')
      .join('.')
  }

  if (!answers || answers.pending) {
    return null
  }

  return (
    <>
      <h4>{`${question.id?.startsWith('T') ? question.id.slice(1) : question.id}. ${question.label[lang]}`}</h4>
      <div className="answer-container">
        <div>
          <i>{t(`formView:monitoringTrackingLabel`)}</i>
          <div className="light-container">
            {lightsHistory.length > 0 ? (
              <>
                {lightsHistory.map((entry, index) => (
                  <div className="light" data-cy={`${entry.color}-${index}`} key={entry.date}>
                    <span className={`answer-circle-big-${entry.color}`} />
                    <div className="light-text">
                      <span>{t(`facultyTracking:${entry.color}`)}</span>
                      {'  '}
                      <span>{formatDate(entry.date)}</span>
                    </div>
                  </div>
                ))}
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
                <p>{facultyAnswers[`${question.id}_${fieldName}_text`] ?? t('formView:noAnswer')}</p>
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
              <div className="flex-item" key={fieldName}>
                <i>{t(`formView:${labels[fieldName]}`)}</i>
                <p>{facultyAnswers[`${question.id}_${fieldName}_text`] ?? t('formView:noAnswer')}</p>
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
              <div className="flex-item" key={fieldName}>
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
      </div>
      {formModalData ? (
        <CustomModal
          closeModal={closeFormModal}
          title={`${formModalData.id?.startsWith('T') ? formModalData.id.slice(1) : formModalData.id}. ${formModalData.label[lang]}`}
        >
          <MonitoringQuestionForm faculty={faculty} question={formModalData} />
        </CustomModal>
      ) : null}
    </>
  )
}

export default Answer
