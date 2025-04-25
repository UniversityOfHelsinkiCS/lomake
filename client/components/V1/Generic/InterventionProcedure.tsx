import { useTranslation } from "react-i18next"
import { Typography, Container, Button } from "@mui/material"
import { Add } from "@mui/icons-material"

const InterventionProcedure = ({ lang, programme }: { lang: 'fi' | 'se' | 'en', programme: string }) => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ alignContent: 'left' }}>
      <Typography variant="h1">{t('interventionProcedure')} </Typography>
      <p>{lang}-{programme}</p>
      <Button variant="outlined"><Add />{t('newDocument')}</Button>
    </Container>
  )
}

export default InterventionProcedure
