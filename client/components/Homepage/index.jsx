/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  CircularProgress,
  Typography,
  Container,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Box,
  Button,
} from '@mui/material'
import { ArrowForward, MailOutlined } from '@mui/icons-material'
import NoPermissions from '../Generic/NoPermissions'
import WritingImage from '../../assets/writing.jpg'
import ArchiveImage from '../../assets/archive.jpg'
import { basePath, isDegreeStudentOrEmployee } from '@/config/common'

const Homepage = () => {
  const { t } = useTranslation()
  const currentUser = useSelector(state => state.currentUser)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)

  useEffect(() => {
    document.title = t('landingPage:title')
  }, [])

  if (!usersProgrammes) return <CircularProgress />

  if (!isDegreeStudentOrEmployee(currentUser.data)) {
    return <NoPermissions requestedForm={t('landingPage:title')} t={t} />
  }

  return (
    <Container maxWidth="md">
      <Box marginBottom={5} marginTop={10} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography data-cy="landingpage-title" sx={{ textAlign: 'center', pb: 4, pt: 2 }} variant="h1">
          {t('landingPage:title').toUpperCase()}
        </Typography>
        <Typography data-cy="landingpage-subtitle" variant="light">
          {t('landingPage:subTitle')}
        </Typography>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 }}>
        <Card sx={{ width: 400, marginTop: 5 }}>
          <CardMedia alt="rypsi" component="img" height="120" image={WritingImage} />
          <CardContent sx={{ height: 200 }}>
            <Typography component="div" gutterBottom sx={{ pb: 2, pt: 1 }} variant="h4regular">
              {t('landingPage:yearlyCardTitle')}
            </Typography>
            <Typography color="text.secondary" variant="lightSmall">
              {t('landingPage:yearlyCardContent')}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'right', p: 2 }}>
            <Button href={`${basePath}v1/overview`} size="small" sx={{ gap: 1, p: 1 }}>
              <Typography variant="h6">{t('landingPage:toYearly')}</Typography>
              <ArrowForward />
            </Button>
          </CardActions>
        </Card>
        {usersProgrammes.length + Object.keys(currentUser.data.access).length > 0 && (
          <Card sx={{ width: 400, marginTop: 5 }}>
            <CardMedia alt="library" component="img" height="120" image={ArchiveImage} />
            <CardContent sx={{ height: 200 }}>
              <Typography component="div" gutterBottom sx={{ pb: 2, pt: 1 }} variant="h4regular">
                {t('landingPage:archiveCardTitle')}
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.3 }} variant="lightSmall">
                {t('landingPage:archiveCardHeader')}
                <ul>
                  <li>{t('landingPage:archiveList1')}</li>
                  <li>{t('landingPage:archiveList2')}</li>
                  <li>{t('landingPage:archiveList3')}</li>
                </ul>
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'right', p: 2 }}>
              <Button href={`${basePath}yearly`} size="small" sx={{ gap: 1, p: 1 }}>
                <Typography variant="h6">{t('landingPage:toArchive')}</Typography>
                <ArrowForward />
              </Button>
            </CardActions>
          </Card>
        )}
      </Box>
      <Box marginTop={10}>
        <Typography alignItems="center" sx={{ textAlign: 'center' }}>
          {t('landingPage:feedback')}
        </Typography>
        <a
          href="mailto:ospa@helsinki.fi"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 8 }}
        >
          <MailOutlined />
          ospa@helsinki.fi
        </a>
      </Box>
    </Container>
  )
}

export default Homepage
