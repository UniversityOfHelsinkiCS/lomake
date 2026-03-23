/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useLocation, useNavigate } from 'react-router'
import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../../util/hooks'
import { useTranslation } from 'react-i18next'
import { setFaculty, setKeyDataYear, setLevel } from '../../../redux/filterReducer'

import KeyDataTableComponent from './OverviewKeyDataTableComponent'
import YearFilter from '../Generic/YearFilterComponent'
import FacultyFilter from '../Generic/FacultyFilterComponent'
import LevelFilter from '../Generic/LevelFilterComponent'
import NoPermissions from '../../Generic/NoPermissions'
import { Alert, Button, Typography } from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { isAdmin, hasSomeReadAccess, isDegreeStudentOrEmployee } from '@/config/common'

const OverviewPage = () => {
  const { t } = useTranslation()
  const lang = useAppSelector(state => state.language)

  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)

  const dispatch = useAppDispatch()
  const selectedFaculties = useAppSelector(state => state.filters.faculty)
  const selectedLevel = useAppSelector(state => state.filters.level)
  const selectedYear = useAppSelector(state => state.filters.keyDataYear)
  const user = useAppSelector(state => state.currentUser.data)

  const readAccess = hasSomeReadAccess(user) || isAdmin(user) || isDegreeStudentOrEmployee(user)
  useEffect(() => {
    // This checks the URL for query parameters and updates the redux store accordingly
    const facultyParams = searchParams.get('faculties')?.split(',') ?? []
    const levelParam = searchParams.get('levels')
    const yearParam = searchParams.get('year')

    if (facultyParams.length > 0) dispatch(setFaculty(facultyParams))
    if (levelParam) dispatch(setLevel(levelParam))
    if (yearParam) dispatch(setKeyDataYear(yearParam))
  }, [dispatch])

  useEffect(() => {
    // This is called whenever the filters change and sets the URL accordingly
    if (selectedFaculties.length > 0 || selectedLevel || selectedYear) {
      navigate({
        pathname: location.pathname,
        search: `?faculties=${selectedFaculties.join(',')}&levels=${selectedLevel}&year=${selectedYear}`,
      })
    }
  }, [selectedFaculties, selectedLevel, selectedYear])

  useEffect(() => {
    document.title = `${t('overview:overviewPage')}`
  }, [lang])

  if (!readAccess) {
    return <NoPermissions requestedForm={t('overview:overviewPage')} t={t} />
  }

  return (
    <>
      <Alert
        icon={false}
        severity="info"
        sx={{
          width: '97%',
          margin: 0,
          justifyContent: 'center',
        }}
        variant="standard"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <Typography variant="light">{t('keyData:feedbackForm')}</Typography>
          <Button
            href="https://www.lyyti.fi/questions/793407eccc"
            rel="noopener noreferrer"
            startIcon={<ArrowForward />}
            target="_blank"
            variant="text"
          >
            {t('keyData:feedbackFormButton')}
          </Button>
        </div>
      </Alert>
      <div style={{ padding: '2rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', width: '100%', marginBottom: '2.5rem' }}>
          <Typography style={{ margin: 0 }} variant="h1">
            {t('landingPage:yearlyAssessmentTitle').toUpperCase()}
          </Typography>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <LevelFilter />
            <FacultyFilter />
            <YearFilter />
          </div>
        </div>

        <KeyDataTableComponent
          facultyFilter={selectedFaculties}
          programmeLevelFilter={selectedLevel}
          yearFilter={selectedYear}
        />
      </div>
    </>
  )
}

export default OverviewPage
