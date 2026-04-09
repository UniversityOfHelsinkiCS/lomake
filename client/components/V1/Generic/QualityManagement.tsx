/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useNavigate, useParams } from 'react-router'
import { Box, IconButton, Typography, CircularProgress } from '@mui/material'
import type { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import { ProgrammeLevel } from '@/client/lib/enums'
import { ArrowBack } from '@mui/icons-material'
import { isAdmin } from '@/config/common'
import { calculateKeyDataColor, getKeyDataPoints } from '@/client/util/v1'
import { TFunction } from 'i18next'
import AddQualityDocument from './AddQualityDocument'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchSingleKeyDataQuery } from '@/client/redux/keyData'
import { Loader } from 'semantic-ui-react'
import { useGetQualityDocumentsQuery } from '@/client/redux/qualityDocuments'
import type { QualityDocumentType } from '@/client/lib/types'
import EditQualityDocument from './EditQualityDocument'
import { useTranslation } from 'react-i18next'

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
  const { programme: programmeKey, id } = useParams<{ programme: string; id: string }>()
  const { isLoading, programme } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })
  const navigate = useNavigate()
  const { t } = useTranslation()
  const lang = useAppSelector(state => state.language) as 'fi' | 'se' | 'en'
  const user = useAppSelector(state => state.currentUser.data)
  const { data: documents = [], isFetching } = useGetQualityDocumentsQuery({ studyprogrammeKey: programmeKey })
  const document =
    documents.length > 0 || !isFetching ? documents.find((doc: QualityDocumentType) => doc.id.toString() === id) : null
  const activeYear = useAppSelector(state => state.filters.keyDataYear)
  const hasWriteRights = user.access[programmeKey]?.write || isAdmin(user)
  const hasDocumentForYear = documents.some((doc: QualityDocumentType) => doc.year == activeYear)

  if (isLoading) return <Loader active />
  // For this function the year variable is not needed cuz
  // intervention procedure is independent from years.
  const programmeData = programme.find(
    (programmeData: KeyDataProgramme) => programmeData.koulutusohjelmakoodi === programmeKey
  )

  const handleBack = () => {
    const shouldRelease = window.confirm(t('qualitydocument:unsavedChangesWarning1'))
    if (shouldRelease) {
      try {
        localStorage.removeItem(`qualityFormCreate_${programmeKey}`)
        localStorage.removeItem(`qualityFormEdit_${programmeKey}_${String(id)}`)
        navigate(`/v1/programmes/10/${programmeKey}`)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to clear form data from localStorage:', error)
      }
    } else {
      return
    }
  }

  if (!programme || !hasWriteRights) return null

  if (isFetching || (!id && hasDocumentForYear)) return <CircularProgress />

  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '2rem', mb: '1rem' }}>
        <IconButton onClick={handleBack} onMouseDown={event => event.stopPropagation()} sx={{ marginRight: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h2">{programmeData.koulutusohjelma[lang]}</Typography>
      </Box>
      <br />
      <br />
      {!id ? (
        <AddQualityDocument programmeKey={programmeData.koulutusohjelmakoodi} />
      ) : (
        <EditQualityDocument document={document} id={id} programmeKey={programmeData.koulutusohjelmakoodi} />
      )}
    </Box>
  )
}

export default QualityManagement
