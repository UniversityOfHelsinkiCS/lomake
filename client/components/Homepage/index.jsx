import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import NoPermissions from '../Generic/NoPermissions'
import { useTranslation } from 'react-i18next'
import { CircularProgress, Typography, Container } from '@mui/material'

const Homepage = () => {
  const { t } = useTranslation()
  const currentUser = useSelector(state => state.currentUser)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)

  useEffect(() => {
    document.title = t('landingPage:title')
  }, [])


  if (!usersProgrammes) return <CircularProgress />

  if (usersProgrammes.length + Object.keys(currentUser.data.access).length < 1) {
    return <NoPermissions t={t} requestedForm={t('landingPage:title')} />
  }

  return (
    <Container >
      <Typography variant='h1' data-cy="landingpage-title" sx={{ textAlign: 'center' }}>
        {t('landingPage:title').toUpperCase()}
      </Typography>
      <Typography variant='light' data-cy="landingpage-subtitle" sx={{ textAlign: 'center' }}>
        {t('landingPage:subTitle')}
      </Typography>
    </Container>
  )
}

export default Homepage
