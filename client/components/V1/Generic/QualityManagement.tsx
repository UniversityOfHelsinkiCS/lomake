/* eslint-disable @typescript-eslint/no-misused-promises */
import { useNavigate, useParams } from 'react-router'
import { Box, IconButton, Typography, CircularProgress } from '@mui/material'
import type { KeyDataProgramme } from '@/shared/lib/types'
import { ArrowBack } from '@mui/icons-material'
import { hasProgrammeWriteAccess } from '../../../../config/common'
import AddQualityDocument from './AddQualityDocument'
import { useAppSelector } from '../../../util/hooks'
import { useFetchSingleKeyDataQuery } from '../../../redux/keyData'
import { useGetQualityDocumentsQuery } from '../../../redux/qualityDocuments'
import type { QualityDocumentType } from '@/client/lib/types'
import EditQualityDocument from './EditQualityDocument'

const QualityManagement = () => {
  const { programme: programmeKey = '', id } = useParams<{ programme: string; id: string }>()
  const { isLoading, programme } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })
  const lang = useAppSelector(state => state.language) as 'fi' | 'se' | 'en'
  const user = useAppSelector(state => state.currentUser.data)
  const { data: documents = [], isFetching } = useGetQualityDocumentsQuery({ studyprogrammeKey: programmeKey })
  const document =
    documents.length > 0 || !isFetching ? documents.find((doc: QualityDocumentType) => doc.id.toString() === id) : null
  const hasWriteRights = hasProgrammeWriteAccess(user, programmeKey)
  const navigate = useNavigate()

  if (isLoading) return <CircularProgress />
  const programmeData = programme.find(
    (programmeData: KeyDataProgramme) => programmeData.koulutusohjelmakoodi === programmeKey
  )

  if (!programme || !programmeData || !hasWriteRights) return null

  if (isFetching && id) return <CircularProgress />

  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '2rem', mb: '1rem' }}>
        <IconButton onClick={() => navigate(`/v1/programmes/10/${programmeKey}`)} sx={{ marginRight: 2 }}>
          <ArrowBack data-cy="back-button" />
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
