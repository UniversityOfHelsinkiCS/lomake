/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-alert */
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { isAdmin } from '@/config/common'
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
import { useFetchLockQuery, useDeleteLockMutation } from '@/client/redux/lock'
import QualityDocumentInfo from '../Generic/QualityDocumentComponent'
import { QualityDocumentType } from '@/client/lib/types'

const QualityManagementComponent = ({ programmeData }) => {
  const { t } = useTranslation()
  const { programme: programmeKey = '' } = useParams<{ programme: string }>()
  const navigate = useNavigate()
  const { data: documents = [] } = useGetQualityDocumentsQuery(
    { studyprogrammeKey: programmeKey },
    {
      pollingInterval: 1000,
    }
  )
  const user = useAppSelector(state => state.currentUser.data)
  const currentUser = useAppSelector(({ currentUser }: { currentUser: Record<string, any> }) => currentUser?.data)
  const form = 10
  const activeYear = useAppSelector(state => state.filters.keyDataYear)
  const { isLoading } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })
  const { data: lockMap } = useFetchLockQuery(
    { room: programmeKey },
    {
      pollingInterval: 1000,
    }
  )
  const hasDocumentForYear = documents.some((doc: QualityDocumentType) => doc.year == activeYear)
  const hasWriteRights = (programmeKey ? user.access?.[programmeKey]?.write : false) || isAdmin(user)

  const draftLockField = `${programmeKey}-quality-draft`
  const someoneElseEditingDraft = !!(
    lockMap?.[draftLockField] &&
    lockMap[draftLockField].uid !== currentUser?.uid &&
    currentUser?.uid
  )

  const currentUserEditingDraft = !!(
    lockMap?.[draftLockField] &&
    lockMap[draftLockField].uid === currentUser?.uid &&
    currentUser?.uid
  )
  const getEditLockField = (docId: number | string) => `${programmeKey}-quality-edit_${String(docId)}`

  const isSomeoneElseEditing = (docId: number | string) => {
    if (!currentUser?.uid) return false
    const lockField = getEditLockField(docId)
    return !!(lockMap?.[lockField] && lockMap[lockField].uid !== currentUser.uid)
  }

  const isCurrentUserEditing = (docId: number | string) => {
    if (!currentUser?.uid) return false
    const lockField = getEditLockField(docId)
    return !!(lockMap?.[lockField] && lockMap[lockField].uid === currentUser.uid)
  }

  const [deleteDocument] = useDeleteQualityDocumentMutation()
  const [deleteLock] = useDeleteLockMutation()

  useEffect(() => {
    document.title = `${t('form')} - ${programmeKey}`
  }, [programmeKey])

  if (isLoading) {
    return <CircularProgress />
  }

  const handleDelete = (id: number | string) => {
    const isConfirmed = window.confirm(t('document:confirmDelete'))
    if (isConfirmed) {
      const idStr = String(id)
      const lockField = getEditLockField(id)
      deleteDocument({ studyprogrammeKey: programmeKey, id: idStr })
      deleteLock({ room: programmeKey, field: lockField })
      try {
        localStorage.removeItem(`qualityFormCreate_${programmeKey}`)
        localStorage.removeItem(`qualityFormEdit_${programmeKey}_${idStr}`)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to clear form data from localStorage:', error)
      }
    }
  }

  return (
    <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Typography sx={{ mb: '2rem' }} variant="h3">
          {t('keyData:qualityControl').toUpperCase()}
        </Typography>
        <Typography sx={{ mt: 4 }} variant="h4">
          {t('keyData:qualitydocumentingHeader')}
        </Typography>
        {!isAdmin(user) ? (
          <Alert severity="info" sx={{ gap: 1 }}>
            <Typography variant="light">{t('keyData:notUsed2025')}</Typography>
          </Alert>
        ) : (
          <Alert severity="info" sx={{ gap: 1, mb: 2 }}>
            <Typography variant="light">{t('qualitydocument:documentingDescription')}</Typography>
          </Alert>
        )}
        {currentUserEditingDraft ? (
          <Typography style={{ color: 'red' }} variant="regular">
            {t('qualitydocument:documentLockedWarning')}
          </Typography>
        ) : null}
        {Array.isArray(documents) &&
          isAdmin(user) &&
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
                      disabled={isSomeoneElseEditing(doc.id)}
                      onClick={() => {
                        if (!isSomeoneElseEditing(doc.id)) {
                          navigate(`/v1/programmes/10/${programmeKey}/qualitydocument/${doc.id}`)
                        }
                      }}
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
                      disabled={isSomeoneElseEditing(doc.id)}
                      onClick={() => {
                        if (!isSomeoneElseEditing(doc.id)) {
                          handleDelete(doc.id)
                        }
                      }}
                      startIcon={<Delete />}
                      variant="contained"
                    >
                      {t('document:delete')}
                    </Button>
                  )}
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'right', gap: '1rem' }}>
                  {isSomeoneElseEditing(doc.id) && (
                    <Typography style={{ color: 'red' }} variant="regular">
                      {t('qualitydocument:documentLocked')}
                    </Typography>
                  )}
                  {isCurrentUserEditing(doc.id) && (
                    <Typography style={{ color: 'red' }} variant="regular">
                      {t('qualitydocument:documentLockedWarning')}
                    </Typography>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}

        {hasWriteRights &&
        !hasDocumentForYear &&
        activeYear > 2025 &&
        !programmeData?.additionalInfo?.fi?.includes('Lakkautettu') ? (
          <Box>
            <Button
              data-cy="create-new-qualitydocument"
              disabled={someoneElseEditingDraft}
              onClick={() => {
                if (!someoneElseEditingDraft) {
                  navigate(`/v1/programmes/${form}/${programmeKey}/qualitydocument/new`)
                }
              }}
              startIcon={<Add />}
              variant="outlined"
            >
              {t('document:newDocument')}
            </Button>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'left', gap: '1rem' }}>
              {someoneElseEditingDraft && (
                <Typography style={{ color: 'red' }} variant="regular">
                  {t('qualitydocument:documentLocked')}
                </Typography>
              )}
            </div>
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}

export default QualityManagementComponent
