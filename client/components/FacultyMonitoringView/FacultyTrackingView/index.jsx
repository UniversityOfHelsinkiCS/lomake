import React, { useEffect, useState, useMemo } from 'react'
import { Menu, MenuItem, Button, Header, Accordion, Icon } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { isAdmin } from '../../../../config/common'
import NoPermissions from '../../Generic/NoPermissions'
import CustomModal from '../../Generic/CustomModal'
import { facultyMonitoringQuestions as questions } from '../../../questionData/index'
import { formKeys } from '../../../../config/data'
import { wsJoinRoom, wsLeaveRoom } from '../../../redux/websocketReducer'
import { clearFormState, setViewOnly } from '../../../redux/formReducer'
import { getTempAnswersByForm } from '../../../redux/tempAnswersReducer'
import Answer from './Answer'
import QuestionPicker from './QuestionPicker'
import FacultyDegreeDropdown from '../FacultyDegreeDropdown'
import './FacultyTrackingView.scss'

const FacultyTrackingView = ({ faculty }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const facultyName = faculties?.find(f => f.code === faculty)?.name[lang]
  const user = useSelector(state => state.currentUser.data)
  const form = formKeys.FACULTY_MONITORING
  const currentRoom = useSelector(state => state.room)
  const fieldName = `selectedQuestionIds`
  const selectedQuestions = useSelector(({ form }) => form.data[fieldName] || [])
  const [questionPickerModalData, setQuestionPickerModalData] = useState(null)
  const [activeAccordions, setActiveAccordions] = useState({})
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const selectedLevel = useSelector(({ filters }) => filters.level)
  const { nextDeadline } = useSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === form) : null

  const hasReadRights = user.access[faculty]?.read || user.specialGroup?.evaluationFaculty || isAdmin(user)
  const hasWriteRights = (user.access[faculty]?.write && user.specialGroup?.evaluationFaculty) || isAdmin(user)

  const questionLevel = selectedLevel === 'doctoral' ? 'doctoral' : 'kandimaisteri'
  const questionData = questions.filter(q => q.level === questionLevel)

  useEffect(() => {
    document.title = `${t('facultymonitoring')} – ${faculty}`

    if (!faculty || !form || !hasReadRights) return
    dispatch(getTempAnswersByForm(form))

    if (!hasWriteRights || !formDeadline) {
      dispatch(wsJoinRoom(faculty, form))
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

  useEffect(() => {
    setActiveAccordions({})
  }, [lang, selectedLevel])

  const filteredQuestions = useMemo(
    () =>
      questionData
        .map((object, index) => ({
          ...object,
          groupId: `group-${index}`,
          parts: object.parts.filter(part => selectedQuestions.includes(part.id)),
        }))
        .filter(object => object.parts.length > 0),
    [questionData, selectedQuestions],
  )

  if (!user || !faculty) return <Redirect to="/" />

  if (!hasReadRights) {
    return <NoPermissions t={t} requestedForm={t('facultymonitoring')} />
  }

  if (!faculties) {
    return null
  }

  const handleAccordionClick = (e, title) => {
    const { index } = title
    setActiveAccordions(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }))
  }

  return (
    <>
      <Menu size="large" className="filter-row" secondary>
        <MenuItem>
          <Button as={Link} to="/faculty-monitoring" icon="arrow left" />
        </MenuItem>
        <MenuItem header className="menu-item-header">
          <h2>
            {t('common:tracking').toUpperCase()}: {facultyName?.toUpperCase()}
          </h2>
        </MenuItem>
        <MenuItem>
          {!viewOnly && (
            <Button
              secondary
              data-cy={`question-picker-${faculty}`}
              onClick={() => setQuestionPickerModalData(questionData)}
              className="select-questions-button"
              content={t('formView:selectQuestions')}
            />
          )}
        </MenuItem>
        <MenuItem>
          <FacultyDegreeDropdown />
        </MenuItem>
      </Menu>

      {questionPickerModalData && (
        <CustomModal
          data-cy="question-picker-modal"
          closeModal={() => setQuestionPickerModalData(null)}
          title={`${t('formView:selectQuestions')} – ${facultyName}`}
        >
          <div className="question-picker-container">
            {questionData.map((group, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="question-group" key={`group-${index}`}>
                <QuestionPicker index={index} label={group.title[lang]} questionsList={group.parts} form={form} />
              </div>
            ))}
            <Button
              data-cy="send-selection-button"
              onClick={() => setQuestionPickerModalData(null)}
              secondary
              content={t('formView:sendSelection')}
              className="send-selection-button"
            />
          </div>
        </CustomModal>
      )}

      <div className="answers-list-container">
        <div className="info-container">
          <h4>{t('facultyTracking:facultyInfoHeader')}</h4>
          <p>{t('facultyTracking:facultyInfo1')}</p>
          <p>{t('facultyTracking:facultyInfo2')}</p>
          <p>{t('facultyTracking:facultyInfo3')}</p>
        </div>

        {filteredQuestions.length > 0 ? (
          filteredQuestions.map(group => (
            <div className="accordion-container" key={group.groupId}>
              <Accordion>
                <Accordion.Title
                  data-cy={`accordion-${group.groupId}`}
                  active={activeAccordions[group.groupId]}
                  index={group.groupId}
                  onClick={handleAccordionClick}
                >
                  <h3>
                    <Icon name="dropdown" />
                    {group.title[lang]}
                  </h3>
                </Accordion.Title>
                {activeAccordions[group.groupId] &&
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
