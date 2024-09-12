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
import './FacultyTrackingView.scss'
import { getTempAnswersByForm } from 'Utilities/redux/tempAnswersReducer'
import Answer from './Answer'

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
  const selectedQuestions = useSelector(({ form }) => form.data[fieldName] || [])
  const answers = useSelector(state => state.tempAnswers.data)

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

  const questionList = modifiedQuestions(lang, form)

  const facultyAnswers = answers ? answers.filter(answer => answer.programme === faculty)[0].data : ''

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
            {t('common:tracking').toUpperCase()}: {facultyName.toUpperCase()}
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
        <CustomModal closeModal={closeQuestionPickerModal} title={`${t('formView:selectQuestions')} – ${facultyName}`}>
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

      <div className="answers-list-container">
        {filteredQuestions.length ? (
          filteredQuestions.map(question => (
            <Answer answer={facultyAnswers} question={question} faculty={faculty}></Answer>
          ))
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
