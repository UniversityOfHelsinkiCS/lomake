import { useLocation, useHistory } from 'react-router'
import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../../util/hooks'
import { useTranslation } from 'react-i18next'
import { setFaculty, setKeyDataYear, setLevel } from '../../../redux/filterReducer'
import { useVisibleOverviewProgrammes } from '../../../util/overview'

import KeyDataTableComponent from './OverviewKeyDataTableComponent'
import YearFilter from '../Generic/YearFilterComponent'
import FacultyFilter from '../Generic/FacultyFilterComponent'
import LevelFilter from '../Generic/LevelFilterComponent'
import NoPermissions from '../../Generic/NoPermissions'
import { Alert, Button, Typography } from '@mui/material'
import { getReports } from '@/client/redux/reportsSlice'
import { ArrowForward } from '@mui/icons-material'

const OverviewPage = () => {
  const { t } = useTranslation()
  const lang = useAppSelector(state => state.language)

  const location = useLocation()
  const history = useHistory()
  const searchParams = new URLSearchParams(location.search)

  const dispatch = useAppDispatch()
  const selectedFaculties = useAppSelector(state => state.filters.faculty)
  const selectedLevel = useAppSelector(state => state.filters.level)
  const selectedYear = useAppSelector(state => state.filters.keyDataYear)
  const currentUser = useAppSelector(state => state.currentUser)
  const programmes = useAppSelector(state => state.studyProgrammes.data)

  useEffect(() => {
    // This checks the URL for query parameters and updates the redux store accordingly
    const facultyParams = searchParams.get('faculties')?.split(',') || []
    const levelParam = searchParams.get('levels')
    const yearParam = searchParams.get('year')

    if (facultyParams.length > 0) dispatch(setFaculty(facultyParams))
    if (levelParam) dispatch(setLevel(levelParam))
    if (yearParam) dispatch(setKeyDataYear(yearParam))
  }, [dispatch])

  useEffect(() => {
    // This is called whenever the filters change and sets the URL accordingly
    if (selectedFaculties.length > 0 || selectedLevel || selectedYear) {
      history.push({
        pathname: location.pathname,
        search: `?faculties=${selectedFaculties.join(',')}&levels=${selectedLevel}&year=${selectedYear}`,
      })
    }
  }, [selectedFaculties, selectedLevel, selectedYear])

  useEffect(() => {
    if (selectedYear) {
      dispatch(getReports({ year: selectedYear }))
    }
  }, [selectedYear])

  useEffect(() => {
    document.title = `${t('overview:overviewPage')}`
  }, [lang])

  const usersProgrammes = useVisibleOverviewProgrammes({
    currentUser,
    programmes,
    showAllProgrammes: false,
    faculty: selectedFaculties,
    dropdownFilter: selectedLevel,
  })

  if (usersProgrammes === null || usersProgrammes.length === 0) {
    return <NoPermissions t={t} requestedForm={t('overview:overviewPage')} />
  }

  return (
    <>
      <Alert
        severity="info"
        icon={false}
        variant="standard"
        sx={{
          width: '97%',
          margin: 0,
          justifyContent: 'center',
        }}
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
            variant="text"
            startIcon={<ArrowForward />}
            href="https://www.lyyti.fi/questions/793407eccc"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('keyData:feedbackFormButton')}
          </Button>
        </div>
      </Alert>
      <div style={{ padding: '2rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', width: '100%', marginBottom: '2.5rem' }}>
          <Typography variant="h1" style={{ margin: 0 }}>
            {t('landingPage:yearlyAssessmentTitle').toUpperCase()}
          </Typography>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <LevelFilter />
            <FacultyFilter />
            <YearFilter />
          </div>
        </div>

        <KeyDataTableComponent
          yearFilter={selectedYear}
          facultyFilter={selectedFaculties}
          programmeLevelFilter={selectedLevel}
        />
      </div>
    </>
  )
}

export default OverviewPage
