import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import FacultyLevelForm from './FacultyLevelForm'
import { formKeys } from '@root/config/data'
import { facultyMonitoringQuestions as questions } from '@root/client/questionData/index'
import { Loader } from 'semantic-ui-react'
import { wsJoinRoom } from 'Utilities/redux/websocketReducer'

const FacultyMonitoringForm = ({ room }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const faculty = faculties ? faculties.find(f => f.code === room) : null
  const form = formKeys.FACULTY_MONITORING

  useEffect(() => {
    document.title = `${t('facultymonitoring')} - ${room}`
    dispatch(wsJoinRoom(room, form))
  }, [faculty, lang, room])

  if (!faculty) return <Loader active inline="centered" />

  return (
    <div>
      <div className="form-container">
        <div className="the-form">
          <h1>{faculty.name[lang]}</h1>
          <FacultyLevelForm room={room} questions={questions} faculty={faculty} form={form} />
        </div>
      </div>
    </div>
  )
}

export default FacultyMonitoringForm
