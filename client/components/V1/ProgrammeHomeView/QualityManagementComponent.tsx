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
import { ExpandMore, Add, Edit, Delete } from '@mui/icons-material'
import { basePath, isAdmin } from '@/config/common'
import { useGetQualityDocumentsQuery, useDeleteQualityDocumentMutation } from '@/client/redux/qualityDocuments'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchSingleKeyDataQuery } from '@/client/redux/keyData'

const QualityManagementComponent = () => {
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const navigate = useNavigate()
  const { data: documents = [] } = useGetQualityDocumentsQuery({ studyprogrammeKey: programmeKey })
  const user = useAppSelector(state => state.currentUser.data)
  const form = 10
  const activeYear = useAppSelector(state => state.filters.keyDataYear)
  const { isLoading } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const hasWriteRights = user.access[programmeKey]?.write || isAdmin(user)

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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography variant="h4">{t('qualitydocument:curriculumProcessHeader')}</Typography>
                    <Typography variant="h5">{t('qualitydocument:curriculumProcess')}:</Typography>
                    <Typography color={doc.data.curriculumProcess ? 'default' : 'secondary'}>
                      {doc.data.curriculumProcess ?? t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography variant="h4">{t('qualitydocument:guidancePoliciesHeader')}</Typography>
                    <Typography variant="h5">{t('qualitydocument:guidancePolicies')}:</Typography>
                    <Typography color={doc.data.guidancePolicies ? 'default' : 'secondary'}>
                      {doc.data.guidancePolicies ?? t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography variant="h4">{t('qualitydocument:feedbackHeader')}</Typography>
                    <Typography variant="h5">{t('qualitydocument:feedbackUtilizationHeader')}:</Typography>
                    <Typography
                      color={
                        Object.entries(doc.data.feedbackUtilization ?? {}).filter(([, value]) => value).length > 0
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {Object.entries(doc.data.feedbackUtilization ?? {}).filter(([, value]) => value).length > 0
                        ? Object.entries(doc.data.feedbackUtilization)
                            .filter(([, value]) => value)
                            .map(([key]) => (
                              <li key={key} style={{ listStyle: 'none' }}>
                                {t(`qualitydocument:${key.charAt(0) + key.slice(1)}`)}
                              </li>
                            ))
                        : t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography sx={{ whiteSpace: 'nowrap' }} variant="h5">
                      {t('qualitydocument:feedbackActions')}:
                    </Typography>
                    <Typography color={doc.data.feedbackActions ? 'default' : 'secondary'}>
                      {doc.data.feedbackActions ?? t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography sx={{ whiteSpace: 'nowrap' }} variant="h5">
                      {t('qualitydocument:feedbackRegularityHeader')}:
                    </Typography>
                    <Typography color={doc.data.actionsRegularity ? 'default' : 'secondary'}>
                      {t(`qualitydocument:${doc.data.actionsRegularity}`) || t('common:empty')}
                    </Typography>
                  </div>
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'right', gap: '1rem' }}>
                  {hasWriteRights ? (
                    <Button
                      data-cy={`accordion-${index}-edit-qualitydocument-button`}
                      onClick={() => navigate(`${basePath}v1/programmes/10/${programmeKey}/qualitydocument/${doc.id}`)}
                      startIcon={<Edit />}
                      variant="contained"
                    >
                      {t('document:edit')}
                    </Button>
                  ) : null}
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

        {hasWriteRights && documents.length === 0 && activeYear > 2025 ? (
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
        ) : null}
      </Box>
    </Box>
  )
}

export default QualityManagementComponent
