import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Box,
  CircularProgress,
  Button,
  Link,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { Add, Delete } from '@mui/icons-material'
import { isAdmin } from '@/config/common'
import { KeyDataProgramme } from '@/shared/lib/types'
import { calculateInterventionAreas } from '../Generic/InterventionProcedure'
import { useCreateQualityDocumentMutation, useGetQualityDocumentsQuery, useDeleteQualityDocumentMutation } from '@/client/redux/qualityDocuments'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchSingleKeyDataQuery } from '@/client/redux/keyData'


const QualityManagementComponent= () => {
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const history = useHistory()
  const { data: documents = [] } = useGetQualityDocumentsQuery({ studyprogrammeKey: programmeKey })
  const user = useAppSelector(state => state.currentUser.data)
  const form = 10
  const startYear = 2024 // The base year of data from which annual follow-up tracking begins

  const { isLoading, programme, metadata } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })

  const hasWriteRights = user.access[programmeKey]?.write || isAdmin(user)

  const [deleteDocument] = useDeleteQualityDocumentMutation()

  const [createDocument] = useCreateQualityDocumentMutation()

  useEffect(() => {
    document.title = `${t('form')} - ${programmeKey}`
  }, [programmeKey])

  if (isLoading) {
    return <CircularProgress />
  }

  const programmeData = programme.filter((programmeData: KeyDataProgramme) => programmeData.koulutusohjelmakoodi === programmeKey && programmeData.year >= startYear)

  const areas = calculateInterventionAreas({ metadata, programme: programmeData[0], t })

 

  const handleClick = () => {
    createDocument({ studyprogrammeKey: programmeKey, data: null })
      .then(({ data }) => history.push(`/v1/programmes/${form}/${programmeKey}/qualitydocument/${data.at(-1).id}`)
      )
  }

  const handleDelete = (id:string) => {
    const isConfirmed = window.confirm(t('document:confirmDelete'))
    console.log(id, programmeKey)
    if (isConfirmed) {
      deleteDocument({ studyprogrammeKey: programmeKey, id })
    }
  }

  const activeProcedure = () => {
    if (areas.length === 0) {
      return false
    }

    if (documents.length === 0) {
      return true
    }
    const lastDocument = documents.at(-1)

    if (!lastDocument.active && lastDocument.activeYear !== new Date().getFullYear()) {
      return true
    }

    return lastDocument.active
  }


  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Typography variant="h3" sx={{ mb: '2rem' }}>
          {t('keyData:qualityControl').toUpperCase()}
        </Typography>
         <Typography variant="h4" sx={{ mt: 4 }}>
          {t('keyData:qualitydocumentingHeader')}
        </Typography>
        {Array.isArray(documents) &&
          documents.map((doc: Record<string, any>, index) => (
            <Accordion key={doc.id} sx={{ padding: '2rem' }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography data-cy={`accordion-${index}`} variant="h4">
                  {doc.data.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography variant="h4">{t('qualitydocument:curriculumProcessHeader')}</Typography>
                    <Typography variant="h5">{t('qualitydocument:curriculumProcess')}:</Typography>
                    <Typography color={doc.data.curriculumProcess ? 'default' : 'secondary'}>
                      {doc.data.curriculumProcess || t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography variant="h4">{t('qualitydocument:guidancePoliciesHeader')}</Typography>
                    <Typography variant="h5">{t('qualitydocument:guidancePolicies')}:</Typography>
                    <Typography color={doc.data.guidancePolicies ? 'default' : 'secondary'}>
                      {doc.data.guidancePolicies || t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography variant="h4">{t('qualitydocument:feedbackHeader')}</Typography>
                    <Typography variant="h5">{t('qualitydocument:feedbackUtilizationHeader')}:</Typography>
                    <Typography color={doc.data.feedbackUtilization ? 'default' : 'secondary'}>
                      {doc.data.feedbackUtilization && Object.entries(doc.data.feedbackUtilization).filter(([, value]) => value).map(([key]) => (
                        <li key={key} style={{ listStyle: 'none' }}>{t(`qualitydocument:${key.charAt(0) + key.slice(1)}`)}</li>
                      )) || t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography variant="h5" sx={{ whiteSpace: 'nowrap' }}>
                      {t('qualitydocument:feedbackActions')}:
                    </Typography>
                    <Typography color={doc.data.feedbackActions ? 'default' : 'secondary'}>
                      {doc.data.feedbackActions || t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography variant="h5" sx={{ whiteSpace: 'nowrap' }}>
                      {t('qualitydocument:feedbackRegularityHeader')}:
                    </Typography>
                    <Typography color={doc.data.actionsRegularity ? 'default' : 'secondary'}>
                      {t(`qualitydocument:${doc.data.actionsRegularity}`) || t('common:empty')}
                    </Typography>
                  </div>
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'right' }}>
                  {isAdmin(user) && !doc.data?.feedbackActions && (
                      <Button
                        data-cy={`accordion-${index}-delete-qualitydocument-button`}
                        variant='contained'
                        color='error'
                        component={Link}
                        onClick={() => handleDelete(doc.id)}
                        startIcon={<Delete />}
                      >
                        {t('document:delete')}
                      </Button>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}

        {hasWriteRights && (
          <Box>
            <Button data-cy="create-new-qualitydocument" onClick={handleClick} variant="outlined" startIcon={<Add />}>
              {t('document:newDocument')}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default QualityManagementComponent
