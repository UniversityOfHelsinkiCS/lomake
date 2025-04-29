import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Alert, Box, CircularProgress, IconButton, Button, Link, Tabs, Tab, Typography } from '@mui/material'
import { Add, ArrowBack } from '@mui/icons-material'
import { basePath, isAdmin, hasSomeReadAccess, inProduction } from '@/config/common'

import { useFetchSingleKeyData } from '../../../hooks/useFetchKeyData'
import { ProgrammeLevel } from '@/client/lib/enums'
import { RootState, AppDispatch } from '@/client/util/store'
import ProgrammeKeyDataTable from './ProgrammeKeyDataTableComponent'
import InterventionProcedure from '../Generic/InterventionProcedure'

const ProgrammeHomeView = () => {
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'en' | 'se'
  const dispatch: AppDispatch = useDispatch()
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const keyData = useFetchSingleKeyData(programmeKey)
  const form = 10
  // const level = programmeKey.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI

  if (!keyData) {
    return <CircularProgress />
  }

  const { programme, metadata } = keyData

  return (
    <Box sx={{ width: '75%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '4rem' }}>
        <IconButton component={Link} href={`${basePath}v1/overview`} sx={{ marginRight: 2 }}>
          <ArrowBack />
        </IconButton>

        <Typography variant="h2">{programme.koulutusohjelma[lang]}</Typography>
      </div>

      <Typography variant="h1" style={{ marginTop: '4rem' }}>
        AVAINLUVUT JA KEHITTÄMISSUUNNITELMA
      </Typography>
      <Typography style={{ marginTop: '2rem' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
      </Typography>

      <Box sx={{ mt: '4rem' }}>
        <ProgrammeKeyDataTable />
      </Box>

      {/* <InterventionProcedure lang={lang} programme={programmeKey} /> */}
    </Box>
  )
}

export default ProgrammeHomeView
