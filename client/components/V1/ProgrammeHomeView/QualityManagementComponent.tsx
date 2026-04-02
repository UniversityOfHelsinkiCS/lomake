/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Box,
  CircularProgress,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material'
import { ExpandMore, Add, Delete, Edit } from '@mui/icons-material'
import { useGetQualityDocumentsQuery, useDeleteQualityDocumentMutation } from '@/client/redux/qualityDocuments'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchSingleKeyDataQuery } from '@/client/redux/keyData'
import QualityDocumentInfo from '../Generic/QualityDocumentComponent'
import { QualityDocumentType } from '@/client/lib/types'

const QualityManagementComponent = () => {
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const navigate = useNavigate()
  const { data: documents = [] } = useGetQualityDocumentsQuery({ studyprogrammeKey: programmeKey })
  const user = useAppSelector(state => state.currentUser.data)
  const form = 10
  const activeYear = useAppSelector(state => state.filters.keyDataYear)
  const { isLoading } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })
  const hasDocumentForYear = documents.some((doc: QualityDocumentType) => doc.year == activeYear)
  const hasWriteRights = (programmeKey ? user.access?.[programmeKey]?.write : false) || isAdmin(user)

  const [deleteDocument] = useDeleteQualityDocumentMutation()

  useEffect(() => {
    document.title = `${t('form')} - ${programmeKey}`
  }, [programmeKey])

  if (isLoading) {
    return <CircularProgress />
  }

  const handleDelete = (id: string) => {
    const isConfirmed = window.confirm(t('document:confirmDelete'))
    if (isConfirmed) {
      deleteDocument({ studyprogrammeKey: programmeKey, id })
      try {
        localStorage.removeItem(`qualityFormCreate_${programmeKey}`)
        localStorage.removeItem(`qualityFormEdit_${programmeKey}_${id}`)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to clear form data from localStorage:', error)
      }
    }
  }

  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Typography sx={{ mb: '2rem' }} variant="h3">
          {t('keyData:qualityControl').toUpperCase()}
        </Typography>
        <Typography sx={{ mt: 4 }} variant="h4">
          {t('keyData:qualitydocumentingHeader')}
        </Typography>
        {activeYear < 2026 ? (
          <Alert severity="info" sx={{ gap: 1 }}>
            <Typography variant="light">{t('keyData:notUsed2025')}</Typography>
          </Alert>
        ) : (
          <Alert severity="info" sx={{ gap: 1, mb: 2 }}>
            <Typography variant="light">{t('qualitydocument:documentingDescription')}</Typography>
          </Alert>
        )}
        {Array.isArray(documents) &&
          documents.map((doc: Record<string, any>, index) => (
            <Accordion key={doc.id} sx={{ padding: '2rem' }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography data-cy={`accordion-${index}-quality-document`} variant="h4">
                  {doc.data.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <QualityDocumentInfo doc={doc} />
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'right', gap: '1rem' }}>
                  {hasWriteRights && (
                    <Button
                      data-cy={`accordion-${index}-edit-qualitydocument-button`}
                      onClick={() => navigate(`/v1/programmes/10/${programmeKey}/qualitydocument/${doc.id}`)}
                      startIcon={<Edit />}
                      variant="contained"
                    >
                      {t('document:edit')}
                    </Button>
                  )}
                  {isAdmin(user) && (
                    <Button
                      color="error"
                      data-cy={`accordion-${index}-delete-qualitydocument-button`}
                      onClick={() => handleDelete(doc.id)}
                      startIcon={<Delete />}
                      variant="contained"
                    >
                      {t('document:delete')}
                    </Button>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}

        {hasWriteRights && !hasDocumentForYear && activeYear > 2025 && (
          <Box>
            <Button
              data-cy="create-new-qualitydocument"
              onClick={() => navigate(`/v1/programmes/${form}/${programmeKey}/qualitydocument/new`)}
              startIcon={<Add />}
              variant="outlined"
            >
              {t('document:newDocument')}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default QualityManagementComponent
