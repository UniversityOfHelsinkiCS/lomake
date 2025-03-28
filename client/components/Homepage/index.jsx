import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import NoPermissions from '../Generic/NoPermissions'
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
import WritingImage from '../../assets/writing.jpg'
import ArchiveImage from '../../assets/archive.jpg'
import { ArrowForward, MailOutlined } from '@mui/icons-material'
import { basePath } from '@/config/common'

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
    <Container maxWidth="md">
      <Box marginTop={10} marginBottom={5} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h1" data-cy="landingpage-title" sx={{ textAlign: 'center', pb: 4, pt: 2 }}>
          {t('landingPage:title').toUpperCase()}
        </Typography>
        <Typography variant="light" data-cy="landingpage-subtitle">
          {t('landingPage:subTitle')}
        </Typography>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 }}>
        <Card sx={{ width: 400, marginTop: 5 }}>
          <CardMedia component="img" height="120" image={WritingImage} alt="rypsi" />
          <CardContent>
            <Typography gutterBottom variant="h4regular" component="div" sx={{ pb: 2 }}>
              {t('landingPage:contentTitleYearly')}
            </Typography>
            <Typography variant="lightSmall" color="text.secondary">
              {t('landingPage:yearly')}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'right', p: 2 }}>
            <Button size="small" disabled sx={{ gap: 1, p: 1 }}>
              <Typography variant="h6">{t('landingPage:toYearly')}</Typography>
              {<ArrowForward />}
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ width: 400, marginTop: 5 }}>
          <CardMedia component="img" height="120" image={ArchiveImage} alt="library" />
          <CardContent>
            <Typography gutterBottom variant="h4regular" component="div" sx={{ pb: 2 }}>
              {t('landingPage:contentTitleArchive')}
            </Typography>
            <Typography variant="lightSmall" color="text.secondary">
              {t('landingPage:archive')}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'right', p: 2 }}>
            <Button size="small" href={`${basePath}yearly`} sx={{ gap: 1, p: 1 }}>
              <Typography variant="h6">{t('landingPage:toArchive')}</Typography>
              {<ArrowForward />}
            </Button>
          </CardActions>
        </Card>
      </Box>
      <Box marginTop={10}>
        <Typography alignItems={'center'} sx={{ textAlign: 'center' }}>
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
