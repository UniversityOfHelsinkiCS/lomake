/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { IconButton, Typography, MenuItem, MenuList } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { Navigate, useNavigate, useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { isAdmin } from '../../../../config/common'
import NoPermissions from '../../Generic/NoPermissions'
import { formKeys } from '../../../../config/data'
import { getTempAnswersByForm } from '../../../redux/tempAnswersReducer'

import FacultyDegreeDropdown from '../FacultyDegreeDropdown'
import './FacultyTrackingView.scss'

const FacultyTrackingView = () => {
  const { faculty } = useParams()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const facultyName = faculties?.find(f => f.code === faculty)?.name[lang]
  const user = useSelector(state => state.currentUser.data)
  const form = formKeys.FACULTY_MONITORING

  const navigate = useNavigate()

  const hasReadRights = user.access[faculty]?.read || user.specialGroup?.evaluationFaculty || isAdmin(user)

  useEffect(() => {
    document.title = `${t('facultymonitoring')} – ${faculty}`
    if (!faculty || !form || !hasReadRights) return
    dispatch(getTempAnswersByForm(form))
  }, [faculty, lang])

  if (!user || !faculty) return <Navigate to="/" />

  if (!hasReadRights) {
    return <NoPermissions requestedForm={t('facultymonitoring')} t={t} />
  }

  if (!faculties) {
    return null
  }

  return (
    <>
      <MenuList className="filter-row" secondary size="large">
        <MenuItem>
          <IconButton onClick={() => navigate(-1)} sx={{ marginRight: 2 }}>
            <ArrowBack data-cy="back-button" />
          </IconButton>
          <Typography variant="h2">
            {t('common:tracking').toUpperCase()}: {facultyName?.toUpperCase()}
          </Typography>
          <FacultyDegreeDropdown />
        </MenuItem>
      </MenuList>

      <div className="answers-list-container">
        <div className="info-container">
          <h4>{t('facultyTracking:facultyInfoHeader')}</h4>
          <p>{t('facultyTracking:facultyInfo1')}</p>
          <p>{t('facultyTracking:facultyInfo2')}</p>
          <p>{t('facultyTracking:facultyInfo3')}</p>
        </div>
        <div className="no-selection-container">
          <Typography color="grey" variant="h3">
            {`${t('formView:noQuestionsSelected')} - Ei käytössä`}
          </Typography>
        </div>
      </div>
    </>
  )
}

export default FacultyTrackingView
