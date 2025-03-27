import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import NoPermissions from '../Generic/NoPermissions'
import { useTranslation } from 'react-i18next'
import {
  CircularProgress,
  Typography,
  Container,
  Card, CardMedia,
  CardActions,
  CardContent,
  Box,
  Button
} from '@mui/material'
import LibraryImage from '../../assets/library.jpg'
import RypsiImage from '../../assets/rypsi.jpg'
import { ArrowForward, MailOutlined } from '@mui/icons-material'

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
    <Container maxWidth='md'>
      <Box marginTop={10} marginBottom={5}>
        <Typography variant='h1' data-cy="landingpage-title" sx={{ textAlign: 'center' }}>
          {t('landingPage:title').toUpperCase()}
        </Typography>
        <Typography variant='light' data-cy="landingpage-subtitle" sx={{ textAlign: 'center', margin: '10rem' }}>
          {t('landingPage:subTitle')}
        </Typography>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 }}>
        <Card sx={{ width: 400, marginTop: 5 }}>
          <CardMedia
            component="img"
            height="120"
            image={RypsiImage}
            alt="rypsi"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {t('landingPage:contentTitleYearly')}
            </Typography>
            <Typography variant="light" color="text.secondary">
              {t('landingPage:yearly')}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'right' }}>
            <Button size="small" disabled>{t('landingPage:toYearly')}{<ArrowForward />}</Button>
          </CardActions>
        </Card>
        <Card sx={{ width: 400, marginTop: 5 }}>
          <CardMedia
            component="img"
            height="120"
            image={LibraryImage}
            alt="library"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {t('landingPage:contentTitleArchive')}
            </Typography>
            <Typography variant="light" color="text.secondary">
              {t('landingPage:archive')}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'right' }}>
            <Button size="small" href='/yearly'>{t('landingPage:toArchive')}{<ArrowForward />}</Button>
          </CardActions>
        </Card>
      </Box>
      <Box marginTop={10}>
        <Typography alignItems={'center'} sx={{ textAlign: 'center' }}>
          {t('landingPage:feedback')}
        </Typography>
        <a href="mailto:ospa@helsinki.fi" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <MailOutlined />
          ospa@helsinki.fi
        </a>
      </Box>
    </Container>
  )
}

export default Homepage
