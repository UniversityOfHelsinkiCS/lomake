import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { Box, IconButton, Typography, Link, Alert } from "@mui/material"
import { useFetchSingleKeyData } from "@/client/hooks/useFetchKeyData"
import { useSelector } from "react-redux"
import { RootState } from "@/client/util/store"
import type { SingleKeyData } from "@/shared/lib/types"
import { GroupKey, ProgrammeLevel } from "@/client/lib/enums"
import { ArrowBack } from "@mui/icons-material"
import { basePath } from "@/config/common"
import KeyDataCard from "./KeyDataCardComponent"

const InterventionProcedure = () => {
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const { t } = useTranslation()
  const keyData: SingleKeyData = useFetchSingleKeyData(programmeKey)
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'se' | 'en'

  const level = programmeKey.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI

  if (!keyData) return null

  const { programme, metadata } = keyData

  const props = {
    title: 'Vetovoimaisuus',
    groupKey: 'VETOVOIMA' as GroupKey,
    description: '',
    textField: true,
  }

  return (
    <Box sx={{ width: '75%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '2rem', mb: '2rem' }}>
        <IconButton component={Link} href={`${basePath}v1/programmes/10/${programmeKey}`} sx={{ marginRight: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h2">{keyData.programme.koulutusohjelma[lang]} - {new Date().toDateString()}</Typography>
      </Box>
      <Alert severity="info">Alert Here</Alert>
      <Typography variant="h4">{t('Esitiedot')}</Typography>
      <Box sx={{ p: '2.5rem 0' }}>
        <KeyDataCard level={level} metadata={metadata} programme={programme} {...props} />
      </Box>
    </Box>
  )
}

export default InterventionProcedure

