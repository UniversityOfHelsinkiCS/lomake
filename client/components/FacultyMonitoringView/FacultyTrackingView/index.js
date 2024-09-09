import React, { useEffect, useState } from 'react'
import { Menu, MenuItem, Button, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { isAdmin } from '@root/config/common'
import NoPermissions from 'Components/Generic/NoPermissions'
import CustomModal from 'Components/Generic/CustomModal'
import { modifiedQuestions } from 'Utilities/common'
import { formKeys } from '@root/config/data'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { clearFormState, setViewOnly } from 'Utilities/redux/formReducer'
import QuestionPicker from './QuestionPicker'
import MonitoringQuestionForm from '../MonitoringQuestionForm/index'
import './FacultyTrackingView.scss'

const FacultyTrackingView = ({ faculty }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  const hasReadRights = (user.access[faculty.code]?.read && user.specialGroup?.evaluationFaculty) || isAdmin(user)
  const form = formKeys.FACULTY_MONITORING
  const [formModalData, setFormModalData] = useState(null)
  const [questionPickerModalData, setQuestionPickerModalData] = useState(null)
  const currentRoom = useSelector(state => state.room)

  const fieldName = `selectedQuestionIds`
  const selectedQuestions = useSelector(({ form }) => form.data[fieldName] || [])

  useEffect(() => {
    document.title = `${t('facultymonitoring')} - ${faculty}`
    if (currentRoom) {
      dispatch(wsLeaveRoom(faculty))
      dispatch(clearFormState())
    } else {
      dispatch(wsJoinRoom(faculty, form))
      dispatch(setViewOnly(false))
    }
  }, [faculty, lang])

  useEffect(() => {
    return () => {
      dispatch(wsLeaveRoom(faculty))
      dispatch({ type: 'RESET_STUDYPROGRAM_SUCCESS' })
      dispatch(clearFormState())
    }
  }, [])

  if (!user || !faculty) return <Redirect to="/" />

  if (!hasReadRights) {
    return <NoPermissions t={t} requestedForm={t('facultymonitoring')} />
  }

  const openFormModal = question => {
    setFormModalData(question)
  }

  const openQuestionPickerModal = questions => {
    setQuestionPickerModalData(questions)
  }

  const closeQuestionModal = () => {
    setFormModalData(null)
  }

  const closeQuestionPickerModal = () => {
    setQuestionPickerModalData(null)
  }

  const questionList = modifiedQuestions(lang, form)

  const filteredQuestions = questionList.filter(question => selectedQuestions.includes(question.id))

  const groupedQuestions = questionList.reduce((acc, question) => {
    const { titleIndex, title } = question

    if (!acc[titleIndex]) {
      acc[titleIndex] = {
        title,
        questions: [],
      }
    }

    acc[titleIndex].questions.push(question)
    return acc
  }, {})

  return (
    <>
      <Menu size="large" className="filter-row" secondary>
        <MenuItem>
          <Button as={Link} to="/faculty-monitoring" icon="arrow left" />
        </MenuItem>
        <MenuItem header className="menu-item-header">
          <h2>
            {t('facultymonitoring').toUpperCase()} - {faculty}
          </h2>
        </MenuItem>
        <MenuItem>
          <Button
            secondary
            onClick={() => openQuestionPickerModal(groupedQuestions)}
            className="select-questions-button"
            content={t('formView:selectQuestions')}
          />
        </MenuItem>
      </Menu>

      {questionPickerModalData && (
        <CustomModal closeModal={closeQuestionPickerModal} title={t('formView:selectQuestions')}>
          <div className="question-picker-container">
            {Object.entries(groupedQuestions).map(([titleIndex, group]) => (
              <div className="question-group" key={titleIndex}>
                <QuestionPicker label={group.title} questionsList={group.questions} form={form} />
              </div>
            ))}
            <Button
              onClick={closeQuestionPickerModal}
              secondary
              content={t('formView:sendSelection')}
              className="send-selection-button"
            />
          </div>
        </CustomModal>
      )}

      <div className="flex-column-container">
        {filteredQuestions.length ? (
          filteredQuestions.map(question => (
            <Button
              key={question.id}
              onClick={() => openFormModal(question)}
              className="question-button"
              content={`${parseInt(question.id, 10)} - ${question.label}`}
            />
          ))
        ) : (
          <div className="no-selection-container">
            <Header as="h3" disabled>
              {t('formView:noQuestionsSelected')}
            </Header>
          </div>
        )}
      </div>

      {formModalData && (
        <CustomModal
          closeModal={closeQuestionModal}
          title={`${parseInt(formModalData.id, 10)} - ${formModalData.label}`}
        >
          <MonitoringQuestionForm question={formModalData} faculty={faculty} />
        </CustomModal>
      )}
    </>
  )
}

export default FacultyTrackingView
