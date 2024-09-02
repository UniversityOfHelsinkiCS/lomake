import React, { useEffect, useState } from 'react'
import { Menu, MenuItem, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { isAdmin } from '@root/config/common'
import NoPermissions from 'Components/Generic/NoPermissions'
import CustomModal from 'Components/Generic/CustomModal'
import MonitoringQuestionForm from '../MonitoringQuestionForm/index'
import { facultyMonitoringQuestions as questions } from '../../../questionData/index'

const FacultyTrackingView = ({ faculty }) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  const hasReadRights = (user.access[faculty.code]?.read && user.specialGroup?.evaluationFaculty) || isAdmin(user)
  const [modalData, setModalData] = useState(null)

  useEffect(() => {
    document.title = `${t('facultymonitoring')} - ${faculty}`
  }, [faculty, lang])

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

      <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start' }}>
        {questions.map(section => (
          <div key={section.title[lang]} style={{ marginBottom: '20px' }}>
            <h2>{section.title[lang]}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {section.parts.map(question => (
                <Button key={question.id} onClick={() => openQuestionModal(question)}>
                  {question.id} - {question.label[lang]}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalData && (
        <CustomModal closeModal={closeModal} title={`${modalData.id} - ${modalData.label[lang]}`}>
          <MonitoringQuestionForm question={modalData} />
        </CustomModal>
      )}
    </>
  )
}

export default FacultyTrackingView
