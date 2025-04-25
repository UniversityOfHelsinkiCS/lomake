import { useTranslation } from "react-i18next"
import { Typography } from "@mui/material"

const InterventionProcedure = ({lang, programme}: {lang: 'fi' | 'se' | 'en', programme: string}) => {
  const { t } = useTranslation()
  
 
  return (
    <div>
      <Typography variant="h1">{t('interventionProcedure')} </Typography>
      <p>{lang}-{programme}</p>
    </div>
  )
}

export default InterventionProcedure
