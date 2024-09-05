import React, { useEffect, useState } from 'react'
import { Menu, MenuItem, Button } from 'semantic-ui-react'
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
import { setViewOnly } from 'Utilities/redux/formReducer'
import QuestionPicker from './QuestionPicker'
import MonitoringQuestionForm from '../MonitoringQuestionForm/index'

const FacultyTrackingView = ({ faculty }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  const hasReadRights = (user.access[faculty.code]?.read && user.specialGroup?.evaluationFaculty) || isAdmin(user)
  const form = formKeys.FACULTY_MONITORING
  const [modalData, setModalData] = useState(null)
  const currentRoom = useSelector(state => state.room)

  const fieldName = `${faculty}_selectedQuestionIds`
  const selectedQuestions = useSelector(({ form }) => form.data[fieldName] || [])

  useEffect(() => {
    document.title = `${t('facultymonitoring')} - ${faculty}`
    if (currentRoom) {
      dispatch(wsLeaveRoom(faculty))
    } else {
      dispatch(wsJoinRoom(faculty, form))
      dispatch(setViewOnly(false))
    }
  }, [faculty, lang])

  useEffect(() => {
    return () => {
      dispatch(wsLeaveRoom(faculty))
      dispatch({ type: 'RESET_STUDYPROGRAM_SUCCESS' })
    }
  }, [])

  if (!user || !faculty) return <Redirect to="/" />

  if (!hasReadRights) {
    return <NoPermissions t={t} requestedForm={t('facultymonitoring')} />
  }

  const openQuestionModal = question => {
    setModalData(question)
  }

  const closeModal = () => {
    setModalData(null)
  }

  const questionList = modifiedQuestions(lang, form)

  const filteredQuestions = questionList.filter(question => selectedQuestions.includes(question.id))

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
      </Menu>

      <QuestionPicker faculty={faculty} label="" questionsList={questionList} form={form} />
      <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start' }}>
        {filteredQuestions.map(question => (
          <Button
            key={question.id}
            onClick={() => openQuestionModal(question)}
            style={{ marginBottom: '1em' }}
            content={`${parseInt(question.id, 10)} - ${question.label}`}
          />
        ))}
      </div>

      {modalData && (
        <CustomModal closeModal={closeModal} title={`${parseInt(modalData.id, 10)} - ${modalData.label}`}>
          <MonitoringQuestionForm question={modalData} faculty={faculty} />
        </CustomModal>
      )}
    </>
  )
}

export default FacultyTrackingView
