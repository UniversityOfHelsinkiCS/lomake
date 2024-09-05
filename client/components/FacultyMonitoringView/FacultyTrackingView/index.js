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
import { facultyMonitoringQuestions as questions } from '../../../questionData/index'

const extractNumbers = list => {
  const pattern = /\d+/
  return list
    .map(item => {
      const match = item.match(pattern)
      return match ? parseInt(match[0], 10) : null
    })
    .filter(num => num !== null) // Filter out any null values
}

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

  const selectedQuestionIds = extractNumbers(selectedQuestions)

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

  const filteredQuestions = questions.map(section => ({
    ...section,
    parts: section.parts.filter(question => selectedQuestionIds.includes(question.id)),
  }))

  const isSelected = id => selectedQuestionIds.includes(id)

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
        {filteredQuestions.map(section => (
          <div key={section.title[lang]} style={{ marginBottom: '20px' }}>
            <h2>{section.title[lang]}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {section.parts.map(question => (
                <Button
                  key={question.id}
                  onClick={() => openQuestionModal(question)}
                  style={{
                    backgroundColor: isSelected(question.id) ? 'lightgreen' : 'white',
                  }}
                >
                  {isSelected(question.id) && '✓ '}
                  {question.id} - {question.label[lang]}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalData && (
        <CustomModal closeModal={closeModal} title={`${modalData.id} - ${modalData.label[lang]}`}>
          <MonitoringQuestionForm question={modalData} faculty={faculty} />
        </CustomModal>
      )}
    </>
  )
}

export default FacultyTrackingView
