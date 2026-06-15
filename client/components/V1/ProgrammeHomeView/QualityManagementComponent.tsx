/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-alert */
import { useNavigate, useParams } from 'react-router'
import { hasProgrammeWriteAccess, isAdmin } from '../../../../config/common'
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
  Tooltip,
} from '@mui/material'
import { ExpandMore, Add, Delete, Edit } from '@mui/icons-material'
import { useGetQualityDocumentsQuery, useDeleteQualityDocumentMutation } from '../../../redux/qualityDocuments'
import { useAppSelector } from '../../../util/hooks'
import { useFetchSingleKeyDataQuery } from '../../../redux/keyData'
import { useFetchLockQuery, useDeleteLockMutation } from '../../../redux/lock'
import QualityDocumentInfo from '../Generic/QualityDocumentComponent'
import { QualityDocumentType } from '../../../lib/types'

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
  const hasWriteRights = hasProgrammeWriteAccess(user, programmeKey)

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
    }
  }

  const draftLockEntry = lockMap?.[draftLockField]
  const draftLockOwner = draftLockEntry
    ? `${draftLockEntry.firstname || ''} ${draftLockEntry.lastname || ''}`.trim() || draftLockEntry.uid
    : ''

  return (
    <Box sx={{ width: '85%', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Typography sx={{ mb: '2rem' }} variant="h3">
          {t('keyData:qualityControl').toUpperCase()}
        </Typography>
        <Typography sx={{ mt: 4 }} variant="h4">
          {t('keyData:qualitydocumentingHeader')}
        </Typography>
        <Alert severity="info" sx={{ gap: 1, mb: 2 }}>
          <Typography variant="light">{t('qualitydocument:documentingDescription')}</Typography>
        </Alert>
        {currentUserEditingDraft ? (
          <Typography style={{ color: 'red' }} variant="regular">
            {t('qualitydocument:documentLockedWarning')}
          </Typography>
        ) : null}
        {Array.isArray(documents) &&
          documents.map((doc: Record<string, any>, index) => {
            const someoneElseEditing = isSomeoneElseEditing(doc.id)
            const isAccordionLocked = someoneElseEditingDraft || someoneElseEditing
            const lockField = getEditLockField(doc.id)
            const lockEntry = lockMap?.[lockField] || (someoneElseEditingDraft ? lockMap?.[draftLockField] : undefined)
            const lockOwnerName = lockEntry
              ? `${lockEntry.firstname || ''} ${lockEntry.lastname || ''}`.trim() || lockEntry.uid
              : ''
            const tooltipTitle = !hasWriteRights
              ? t('qualitydocument:documentLocked')
              : t('qualitydocument:documentLockedFor', { user: lockOwnerName })

            return (
              <Tooltip
                arrow
                disableHoverListener={!isAccordionLocked}
                key={`${doc.id}-${isAccordionLocked ? 'locked' : 'unlocked'}`}
                placement="top"
                slotProps={{ popper: { sx: { '& .MuiTooltip-tooltip': { maxWidth: '700px' } } } }}
                title={<div>{isAccordionLocked ? tooltipTitle : null}</div>}
              >
                <span>
                  <Accordion disabled={isAccordionLocked} sx={{ padding: '2rem' }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography data-cy={`accordion-${index}-quality-document`} variant="h4">
                        {t('qualitydocument:header')} {`${doc.data.title.split('-')[1] || ''}`.trim()}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <QualityDocumentInfo doc={doc} />
                      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'right', gap: '1rem' }}>
                        {hasWriteRights && (
                          <Button
                            data-cy={`accordion-${index}-edit-qualitydocument-button`}
                            disabled={someoneElseEditing}
                            onClick={() => {
                              if (!someoneElseEditing) {
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
                            disabled={someoneElseEditing}
                            onClick={() => {
                              if (!someoneElseEditing) {
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
                      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'left', gap: '1rem' }}>
                        {isCurrentUserEditing(doc.id) && hasWriteRights && (
                          <Typography style={{ color: 'red' }} variant="regular">
                            {t('qualitydocument:documentLockedWarning')}
                          </Typography>
                        )}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </span>
              </Tooltip>
            )
          })}
        {hasWriteRights &&
        !hasDocumentForYear &&
        activeYear > 2025 &&
        !programmeData?.additionalInfo?.fi?.includes('Lakkautettu') ? (
          <Box>
            {(() => {
              return (
                <>
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
                    {t('qualitydocument:newDocument')}
                  </Button>
                  <br />
                  {someoneElseEditingDraft && (
                    <Typography style={{ color: 'red', marginTop: '0.5rem' }} variant="regular">
                      {!hasWriteRights
                        ? t('qualitydocument:documentLocked')
                        : t('qualitydocument:documentLockedFor', { user: draftLockOwner })}
                    </Typography>
                  )}
                </>
              )
            })()}
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}

export default QualityManagementComponent
