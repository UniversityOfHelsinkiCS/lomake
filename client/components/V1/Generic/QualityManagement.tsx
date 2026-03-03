import { useParams } from 'react-router'
import {
  Box,
  IconButton,
  Typography,
  Link,
} from '@mui/material'
import type { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import { ProgrammeLevel } from '@/client/lib/enums'
import { ArrowBack } from '@mui/icons-material'
import { basePath, isAdmin } from '@/config/common'
import { calculateKeyDataColor, getKeyDataPoints } from '@/client/util/v1'
import { TFunction } from 'i18next'
import QualityForm from './QualityForm'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchSingleKeyDataQuery } from '@/client/redux/keyData'
import { Loader } from 'semantic-ui-react'

export const calculateInterventionAreas = ({
  metadata,
  programme,
  t,
}: {
  metadata: KeyDataMetadata[]
  programme: KeyDataProgramme
  t: TFunction
}) => {
  let res: string[] = []
  if (!metadata || !programme) return res
  const keyDataPoints = getKeyDataPoints(t)
  Object.values(keyDataPoints).map((point: any) => {
    const color = calculateKeyDataColor(metadata, programme, point.groupKey, programme.level as ProgrammeLevel)
    if (color === 'Punainen') res.push(point.groupKey)
  })
  return res
}

const QualityManagement = () => {
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const { isLoading, programme } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })
  const lang = useAppSelector(state => state.language) as 'fi' | 'se' | 'en'
  const user = useAppSelector(state => state.currentUser.data)


  const hasWriteRights = user.access[programmeKey]?.write || isAdmin(user)

  if (isLoading) return <Loader active />
  // For this function the year variable is not needed cuz
  // intervention procedure is independent from years.
  const programmeData = programme.find(
    (programmeData: KeyDataProgramme) => programmeData.koulutusohjelmakoodi === programmeKey,
  )


  if (!programme || !hasWriteRights) return null

  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '2rem', mb: '1rem' }}>
        <IconButton component={Link} href={`${basePath}v1/programmes/10/${programmeKey}`} sx={{ marginRight: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h2">
          {programmeData.koulutusohjelma[lang]}
        </Typography>
      </Box>
      <br />
      <br />
      <QualityForm programmeKey={programmeData.koulutusohjelmakoodi} />
    </Box>
  )
}

export default QualityManagement
