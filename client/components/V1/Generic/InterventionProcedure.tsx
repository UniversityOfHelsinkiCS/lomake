import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { Box, Typography } from "@mui/material"

const InterventionProcedure = () => {
  const { t } = useTranslation()

  const handleClick = () => {

  }

  return (
    <Box sx={{ alignContent: 'left', mt: '4rem' }}>
      <Typography variant="h1">INTERVENTION DOCUMENT</Typography>
    </Box>
  )
}

export default InterventionProcedure

