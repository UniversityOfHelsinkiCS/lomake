import React, { useEffect, useState } from 'react'
import { Menu, MenuItem, Button, Header, Accordion, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { isAdmin, isKatselmusProjektiOrOhjausryhma } from '@root/config/common'
import NoPermissions from 'Components/Generic/NoPermissions'
import CustomModal from 'Components/Generic/CustomModal'
import { facultyMonitoringQuestions as questions } from '@root/client/questionData/index'
import { formKeys } from '@root/config/data'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { clearFormState, setViewOnly } from 'Utilities/redux/formReducer'
import QuestionPicker from './QuestionPicker'
import Answer from './Answer'
import './FacultyTrackingView.scss'

const FacultyTrackingView = ({ faculty }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const facultyName = faculties && faculties.find(f => f.code === faculty).name[lang]
  const user = useSelector(state => state.currentUser.data)
  const form = formKeys.FACULTY_MONITORING
  const currentRoom = useSelector(state => state.room)
  const fieldName = `selectedQuestionIds`
  const selectedQuestions = useSelector(({ form }) => form.data[fieldName] || [])
  const [questionPickerModalData, setQuestionPickerModalData] = useState(null)
  const [activeAccordions, setActiveAccordions] = useState({})

  const hasReadRights =
    user.access[faculty.code] ||
    isAdmin(user) ||
    isKatselmusProjektiOrOhjausryhma(user) ||
    Object.keys(user.access).length > 0

  const hasWriteRights = (user.access[faculty.code]?.write && user.specialGroup?.evaluationFaculty) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('facultymonitoring')} – ${faculty}`
  }, [lang, faculty])

  useEffect(() => {
    if (!faculty || !form) return
    if (!hasReadRights) {
      return
    }
    if (!hasWriteRights) {
      dispatch(setViewOnly(true))
      if (currentRoom) {
        dispatch(wsLeaveRoom(faculty))
        dispatch(clearFormState())
      }
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

  if (!faculties) {
    return null
  }

  const openQuestionPickerModal = questions => {
    setQuestionPickerModalData(questions)
  }

  const closeQuestionPickerModal = () => {
    setQuestionPickerModalData(null)
  }

  const handleAccordionClick = (e, title) => {
    const { index } = title
    setActiveAccordions(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }))
  }

  const filteredQuestions = questions
    .map(object => ({
      ...object,
      parts: object.parts.filter(part => selectedQuestions.includes(part.id)),
    }))
    .filter(object => object.parts.length > 0)

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
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map(group => (
            <div className="accordion-container" key={`group-${group.title[lang]}`}>
              <Accordion>
                <Accordion.Title
                  active={activeAccordions[`group-${group.title[lang]}`]}
                  index={`group-${group.title[lang]}`}
                  onClick={handleAccordionClick}
                >
                  <h3>
                    <Icon name="dropdown" />
                    {group.title[lang]}
                  </h3>
                </Accordion.Title>
                {activeAccordions[`group-${group.title[lang]}`] &&
                  group.parts.map(part => <Answer question={part} faculty={faculty} key={part.id} />)}
              </Accordion>
            </div>
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
