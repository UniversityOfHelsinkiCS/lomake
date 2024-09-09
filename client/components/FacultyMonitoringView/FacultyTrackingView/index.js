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
  console.log(faculty.name)

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
        <MenuItem header style={{ paddingLeft: 0 }}>
          <h2 style={{ maxWidth: '16em' }}>
            {t('facultymonitoring').toUpperCase()} - {faculty}
          </h2>
        </MenuItem>
        <MenuItem position="right">
          <Button
            secondary
            onClick={() => openQuestionPickerModal(groupedQuestions)}
            style={{ marginBottom: '1em' }}
            content={t('formView:selectQuestions')}
          />
        </MenuItem>
      </Menu>

      {questionPickerModalData && (
        <CustomModal closeModal={closeQuestionPickerModal} title={t('formView:selectQuestions')}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Object.entries(groupedQuestions).map(([titleIndex, group]) => (
              <div key={titleIndex} style={{ margin: '15px 0px' }}>
                <QuestionPicker label={group.title} questionsList={group.questions} form={form} />
              </div>
            ))}
            <Button
              onClick={closeQuestionPickerModal}
              secondary
              content={t('formView:sendSelection')}
              style={{ alignSelf: 'flex-end', marginTop: '1em' }}
            />
          </div>
        </CustomModal>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', width: '100%' }}>
        {filteredQuestions.length ? (
          filteredQuestions.map(question => (
            <Button
              key={question.id}
              onClick={() => openFormModal(question)}
              style={{ marginBottom: '1em' }}
              content={`${parseInt(question.id, 10)} - ${question.label}`}
            />
          ))
        ) : (
          <div style={{ width: '100%', textAlign: 'center', marginTop: '25px' }}>
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
