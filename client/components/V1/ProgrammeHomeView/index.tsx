import { useMemo } from 'react'
import useFetchKeyData from '@/client/hooks/useFetchKeyData'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Box, CircularProgress, IconButton, Button, Link, Typography } from '@mui/material'
import { Add, ArrowBack } from '@mui/icons-material'
import { basePath, isAdmin, hasSomeReadAccess, inProduction } from '@/config/common'
import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'

import { RootState, AppDispatch } from '@/client/util/store'
import ProgrammeKeyDataTable from './ProgrammeKeyDataTableComponent'
import InterventionProcedure from '../Generic/InterventionProcedure'

const ProgrammeHomeView = () => {
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'en' | 'se'
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()

  const dispatch: AppDispatch = useDispatch()
  const form = 10

  const keyData = useFetchKeyData()

  const metadata = useMemo(() => {
    return keyData?.data ? keyData.data.metadata : []
  }, [keyData])

  const programmeData = useMemo(() => {
    if (keyData) {
      const { kandiohjelmat, maisteriohjelmat } = keyData.data
      return [...kandiohjelmat, ...maisteriohjelmat]
    }
    return []
  }, [keyData])

  const keyFigureData = useMemo(() => {
    const filteredData = programmeData.filter(
      (programmeData: KeyDataProgramme) => programmeData.koulutusohjelmakoodi === programmeKey,
    )
    return filteredData
  }, [programmeData])

  if (!keyData) {
    return <CircularProgress />
  }

  return (
    <Box sx={{ width: '75%' }}>
      <div style={{ display: 'flex', marginTop: '4rem', alignItems: 'center' }}>
        <IconButton component={Link} href={`${basePath}v1/overview`} sx={{ marginRight: 2 }}>
          <ArrowBack />
        </IconButton>

        <Typography variant="h2">{keyFigureData[0].koulutusohjelma[lang]}</Typography>
      </div>

      <Typography variant="h1" style={{ marginTop: '4rem' }}>
        AVAINLUVUT JA KEHITTÄMISSUUNNITELMA
      </Typography>
      <Typography style={{ marginTop: '2rem' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
      </Typography>

      <Box sx={{ mt: '4rem' }}>
        <ProgrammeKeyDataTable programmeData={keyFigureData} metadata={metadata} />
      </Box>

      <Box sx={{ mt: '8rem' }}>
        <Typography variant="h1">{t('interventionProcedure')} </Typography>
        <Box sx={{ mt: '2rem', mb: '2rem' }}>
          <Typography variant="light">LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem</Typography>
        </Box>
        <Box>
          <Button component={Link} href={`${basePath}v1/programme/${form}/${programmeKey}/doc`} variant="outlined">
            <Add />
            {t('newDocument')}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ProgrammeHomeView
