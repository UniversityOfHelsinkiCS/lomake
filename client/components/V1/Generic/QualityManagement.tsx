import { useParams } from 'react-router'
import { Box, IconButton, Typography, CircularProgress } from '@mui/material'
import type { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import { ProgrammeLevel } from '@/client/lib/enums'
import { ArrowBack } from '@mui/icons-material'
import { basePath, hasProgrammeWriteAccess } from '@/config/common'
import { calculateKeyDataColor, getKeyDataPoints } from '@/client/util/v1'
import { TFunction } from 'i18next'
import AddQualityDocument from './AddQualityDocument'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchSingleKeyDataQuery } from '@/client/redux/keyData'
import { Loader } from 'semantic-ui-react'
import { useGetQualityDocumentsQuery } from '@/client/redux/qualityDocuments'
import type { QualityDocumentType } from '@/client/lib/types'
import EditQualityDocument from './EditQualityDocument'
import { Link } from '../../Link'

export const calculateInterventionAreas = ({
  metadata,
  programme,
  t,
}: {
  metadata: KeyDataMetadata[]
  programme: KeyDataProgramme
  t: TFunction
}) => {
  const res: string[] = []
  if (!metadata || !programme) return res
  const keyDataPoints = getKeyDataPoints(t)
  Object.values(keyDataPoints).map((point: any) => {
    const color = calculateKeyDataColor(metadata, programme, point.groupKey, programme.level as ProgrammeLevel)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (color === 'Punainen') res.push(point.groupKey)
  })
  return res
}

const QualityManagement = () => {
  const { programme: programmeKey = '', id } = useParams<{ programme: string; id: string }>()
  const { isLoading, programme } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })
  const lang = useAppSelector(state => state.language) as 'fi' | 'se' | 'en'
  const user = useAppSelector(state => state.currentUser.data)
  const { data: documents = [], isFetching } = useGetQualityDocumentsQuery({ studyprogrammeKey: programmeKey })
  const document =
    documents.length > 0 || !isFetching ? documents.find((doc: QualityDocumentType) => doc.id.toString() === id) : null
  const hasWriteRights = hasProgrammeWriteAccess(user, programmeKey)

  if (isLoading) return <Loader active />
  // For this function the year variable is not needed cuz
  // intervention procedure is independent from years.
  const programmeData = programme.find(
    (programmeData: KeyDataProgramme) => programmeData.koulutusohjelmakoodi === programmeKey
  )

  if (!programme || !programmeData || !hasWriteRights) return null

  if (isFetching && id) return <CircularProgress />

  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '2rem', mb: '1rem' }}>
        <IconButton component={Link} sx={{ marginRight: 2 }} to={`${basePath}v1/programmes/10/${programmeKey}`}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h2">{programmeData?.koulutusohjelma[lang]}</Typography>
      </Box>
      <br />
      <br />
      {!id ? (
        <AddQualityDocument programmeKey={programmeData.koulutusohjelmakoodi} />
      ) : (
        <EditQualityDocument document={document ?? {}} id={id} programmeKey={programmeData.koulutusohjelmakoodi} />
      )}
    </Box>
  )
}

export default QualityManagement
