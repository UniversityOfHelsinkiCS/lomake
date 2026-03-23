import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Box, CircularProgress, IconButton, Link, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { basePath } from '@/config/common'
import { KeyDataProgramme } from '@/shared/lib/types'
import ProgrammeKeyDataTable from './ProgrammeKeyDataTableComponent'
import BreadcrumbComponent from '../Generic/BreadcrumbComponent'
import InterventionComponent from './InterventionComponent'
import QualityManagementComponent from './QualityManagementComponent'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchKeyDataMetadataForYearQuery, useFetchSingleKeyDataQuery } from '@/client/redux/keyData'

const ProgrammeHomeView = () => {
  const lang = useAppSelector(state => state.language) as 'fi' | 'en' | 'se'
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const form = 10
  const startYear = 2024 // The base year of data from which annual follow-up tracking begins

  const { isLoading, programme, metadata } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })
  const { isLoading: isMetadata2025Loading, metadata: metadata2025 } = useFetchKeyDataMetadataForYearQuery({
    year: '2025',
  })

  useEffect(() => {
    document.title = `${t('form')} - ${programmeKey}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programmeKey])

  if (isLoading || isMetadata2025Loading) {
    return <CircularProgress />
  }

  const programmeData = programme.filter(
    (programmeData: KeyDataProgramme) =>
      programmeData.koulutusohjelmakoodi === programmeKey && programmeData.year >= startYear
  )

  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <div style={{ marginTop: '4rem' }}>
        <BreadcrumbComponent
          links={[
            { label: t('keyData:overview'), href: `${basePath}v1/overview` },
            { label: t('keyData:programmeHome'), href: `${basePath}v1/programmes/${form}/${programmeKey}` },
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
          <IconButton component={Link} data-cy="navigate-back" href={`${basePath}v1/overview`} sx={{ marginRight: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h2">{programmeData[0].koulutusohjelma[lang]}</Typography>
        </div>
      </div>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ mb: 2 }} variant="h3">
          {t('keyData:homeHeader').toUpperCase()}
        </Typography>
        <Typography variant="light">{t('keyData:homeDescription')}</Typography>
        <ProgrammeKeyDataTable metadata={metadata} metadata2025={metadata2025} programmeData={programmeData} />
      </Box>
      <QualityManagementComponent />
      <InterventionComponent />
    </Box>
  )
}

export default ProgrammeHomeView
