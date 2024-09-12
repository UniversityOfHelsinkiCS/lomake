import React, { useEffect, useState, useMemo } from 'react'
import { Menu, MenuItem, Button, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { isAdmin } from '@root/config/common'
import NoPermissions from 'Components/Generic/NoPermissions'
import CustomModal from 'Components/Generic/CustomModal'
import { getGroupedQuestions, modifiedQuestions } from 'Utilities/common'
import { formKeys } from '@root/config/data'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { clearFormState, setViewOnly } from 'Utilities/redux/formReducer'
import { getTempAnswersByForm } from 'Utilities/redux/tempAnswersReducer'
import QuestionPicker from './QuestionPicker'
import Answer from './Answer'
import './FacultyTrackingView.scss'
import { facultyMonitoringQuestions } from '@root/client/questionData/index'

const FacultyTrackingView = ({ faculty }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const facultyName = faculties.find(f => f.code === faculty).name[lang]
  const user = useSelector(state => state.currentUser.data)
  const hasReadRights = (user.access[faculty.code]?.read && user.specialGroup?.evaluationFaculty) || isAdmin(user)
  const form = formKeys.FACULTY_MONITORING
  const [questionPickerModalData, setQuestionPickerModalData] = useState(null)
  const currentRoom = useSelector(state => state.room)
  const fieldName = `selectedQuestionIds`
  const questions = facultyMonitoringQuestions
  const selectedQuestions = useSelector(({ form }) => form.data[fieldName] || [])
  const answers = useSelector(state => state.tempAnswers.data)
  const facultyAnswers = useMemo(() => {
    return answers ? answers.find(answer => answer.programme === faculty)?.data : ''
  }, [answers, faculty])

  useEffect(() => {
    document.title = `${t('facultymonitoring')} – ${faculty}`
    dispatch(getTempAnswersByForm(form))

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

  const openQuestionPickerModal = questions => {
    setQuestionPickerModalData(questions)
  }

  const closeQuestionPickerModal = () => {
    setQuestionPickerModalData(null)
  }

  const filteredQuestions = questions.filter(question => selectedQuestions.includes(question.id))

  return (
    <>
      <Menu size="large" className="filter-row" secondary>
        <MenuItem>
          <Button as={Link} to="/faculty-monitoring" icon="arrow left" />
        </MenuItem>
        <MenuItem header className="menu-item-header">
          <h2>
            {t('common:tracking').toUpperCase()}: {facultyName.toUpperCase()}
          </h2>
        </MenuItem>
        <MenuItem>
          <Button
            secondary
            onClick={() => openQuestionPickerModal(questions)}
            className="select-questions-button"
            content={t('formView:selectQuestions')}
          />
        </MenuItem>
      </Menu>

      {questionPickerModalData && (
        <CustomModal closeModal={closeQuestionPickerModal} title={`${t('formView:selectQuestions')} – ${facultyName}`}>
          <div className="question-picker-container">
            {Object.entries(questions).map(([titleIndex, group]) => (
              <div className="question-group" key={titleIndex}>
                <QuestionPicker label={group.title[lang]} questionsList={group.parts} form={form} />
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

      <div className="answers-list-container">
        {filteredQuestions.length ? (
          filteredQuestions.map(question => <Answer answer={facultyAnswers} question={question} faculty={faculty} />)
        ) : (
          <div className="no-selection-container">
            <Header as="h3" disabled>
              {t('formView:noQuestionsSelected')}
            </Header>
          </div>
        )}
      </div>
    </>
  )
}

export default FacultyTrackingView
