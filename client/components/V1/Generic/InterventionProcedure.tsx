import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { Box, Typography } from "@mui/material"
import { useFetchSingleKeyData } from "@/client/hooks/useFetchKeyData"
import { useSelector } from "react-redux"
import { RootState } from "@/client/util/store"
import { SingleKeyData } from "@/shared/lib/types"

const InterventionProcedure = () => {
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const keyData: SingleKeyData = useFetchSingleKeyData(programmeKey)
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'se' | 'en'

  return (
    <Box sx={{ alignContent: 'left', mt: '4rem' }}>
      <Typography variant="h1">INTERVENTION DOCUMENT</Typography>
      <Typography>{keyData.programme.koulutusohjelma[lang]}</Typography>
    </Box>
  )
}

export default InterventionProcedure

