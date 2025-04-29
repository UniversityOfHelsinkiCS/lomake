import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { Box, IconButton, Typography, Link } from "@mui/material"
import { useFetchSingleKeyData } from "@/client/hooks/useFetchKeyData"
import { useSelector } from "react-redux"
import { RootState } from "@/client/util/store"
import { SingleKeyData } from "@/shared/lib/types"
import { ArrowBack } from "@mui/icons-material"
import { basePath } from "@/config/common"

const InterventionProcedure = () => {
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const keyData: SingleKeyData = useFetchSingleKeyData(programmeKey)
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'se' | 'en'

  if (!keyData) return null

  return (
    <Box sx={{ alignContent: 'left', mt: '4rem' }}>
      <Typography variant="h1">INTERVENTION DOCUMENT</Typography>
      <IconButton component={Link} href={`${basePath}v1/programmes/10/${programmeKey}`} sx={{ marginRight: 2 }}>
        <ArrowBack />
      </IconButton>
      <Typography>{keyData.programme.koulutusohjelmakoodi}-{keyData.programme.koulutusohjelma[lang]}</Typography>
    </Box>
  )
}

export default InterventionProcedure

