import { useTranslation } from "react-i18next"
import { Card, Typography, Box, Button } from "@mui/material"
import { Add } from "@mui/icons-material"

const InterventionProcedure = ({ lang, programme }: { lang: 'fi' | 'se' | 'en', programme: string }) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ alignContent: 'left', mt: '4rem' }}>
      <Typography variant="h1">{t('interventionProcedure')} </Typography>
      <Box sx={{ mt: "2rem", mb: "2rem" }}>
        <Typography variant="light">LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem</Typography>
      </Box>
      <Box>
        <Button variant="outlined"><Add />{t('newDocument')}</Button>
      </Box>
    </Box>
  )
}

export default InterventionProcedure
