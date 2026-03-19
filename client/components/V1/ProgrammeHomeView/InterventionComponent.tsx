/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
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
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material'
import { ExpandMore, Add, Edit, Delete } from '@mui/icons-material'
import { basePath, dekanaattiIamGroup, isAdmin } from '@/config/common'
import { KeyDataProgramme } from '@/shared/lib/types'
import { calculateInterventionAreas } from '../Generic/InterventionProcedure'
import { useGetProgrammesInterventionProceduresQuery } from '@/client/redux/interventionProcedures'
import {
  useGetDocumentsQuery,
  useCloseInterventionProcedureMutation,
  useDeleteDocumentMutation,
} from '@/client/redux/documents'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchSingleKeyDataQuery } from '@/client/redux/keyData'
import { InterventionProcedureType } from '@/client/lib/types'

const InterventionComponent = () => {
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const navigate = useNavigate()
  const { data: documents = [] } = useGetDocumentsQuery({ studyprogrammeKey: programmeKey })
  const user = useAppSelector(state => state.currentUser.data)
  const form = 10
  const startYear = 2024 // The base year of data from which annual follow-up tracking begins
  const selectedYear = useAppSelector(state => state.filters.keyDataYear)
  const { isLoading, programme, metadata } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const hasWriteRights = user.access[programmeKey]?.write || isAdmin(user)

  const [reason, setReason] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  const [closeInterventionProcedure] = useCloseInterventionProcedureMutation()
  const [deleteDocument] = useDeleteDocumentMutation()

  useEffect(() => {
    document.title = `${t('form')} - ${programmeKey}`
  }, [programmeKey])

  if (isLoading) {
    return <CircularProgress />
  }

  const programmeData = programme.filter(
    (programmeData: KeyDataProgramme) =>
      programmeData.koulutusohjelmakoodi === programmeKey && programmeData.year >= startYear
  )

  const areas = calculateInterventionAreas({ metadata, programme: programmeData[0], t, selectedYear })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: interventionProcedures = [] } = useGetProgrammesInterventionProceduresQuery({
    studyprogrammeKey: programmeKey,
  })
  const hasActiveInterventionProceduresForSameOrEarlierYears = interventionProcedures.some(
    (procedure: InterventionProcedureType) => procedure.active && procedure.startYear <= selectedYear
  )
  const hasEndedInterventionProceduresForSameYear = interventionProcedures.some(
    (procedure: InterventionProcedureType) => !procedure.active && procedure.endYear === new Date().getFullYear()
  )

  const handleDelete = (id: string) => {
    const isConfirmed = window.confirm(t('document:confirmDelete'))
    if (isConfirmed) {
      deleteDocument({ studyprogrammeKey: programmeKey, id })
    }
  }

  const handleCloseProcedure = () => {
    const isConfirmed = window.confirm(t('document:confirm'))
    if (isConfirmed) {
      const data = {
        reason,
        additionalInfo,
      }
      closeInterventionProcedure({ studyprogrammeKey: programmeKey, data })
    }
  }

  const activeProcedure = () => {
    if (hasActiveInterventionProceduresForSameOrEarlierYears) {
      return true
    }
    if (areas.length === 0) {
      return false
    }

    if (hasEndedInterventionProceduresForSameYear) {
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
  const hasAccessToCloseInterventionProcedure = () => {
    const isUserInDekanaattiGroup = user.iamGroups.some((group: string) => dekanaattiIamGroup.includes(group))
    return isAdmin(user) || isUserInDekanaattiGroup
  }

  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Typography variant="h3">{t('keyData:interventionProcedure').toUpperCase()} </Typography>
        <Typography variant="light">{t('document:homeDescription')}</Typography>
        <Alert severity={activeProcedure() ? 'warning' : 'success'} sx={{ gap: 1 }}>
          <Typography sx={{ mb: 2, display: activeProcedure() ? 'block' : 'none' }} variant="h6">
            {t('document:warningTextHeader')}
          </Typography>
          <Typography variant="light">
            {activeProcedure() ? t('document:warningTextDescription') : t('document:successText')}
          </Typography>
        </Alert>
        {documents.length > 0 && documents.at(-1).reason ? (
          <Alert severity="info">
            <Typography variant="h6">{t('document:terminated')}</Typography>
            <Typography>{t(`document:option${documents.at(-1).reason.reason}`)}</Typography>
          </Alert>
        ) : null}
        <Typography sx={{ mt: 4 }} variant="h4">
          {t('keyData:documentingHeader')}
        </Typography>
        <Alert severity="info" sx={{ gap: 1, mb: 2 }}>
          <Typography variant="light">{t('document:documentingDescription1')}</Typography>
          <br />
          <br />
          <Typography variant="light">{t('document:documentingDescription2')}</Typography>
        </Alert>
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
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant="h5">{t('document:date')}:</Typography>
                    <Typography color={doc.data.date ? 'default' : 'secondary'}>
                      {(doc.data.date && new Date(doc.data.date).toLocaleDateString('fi-FI')) ?? t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant="h5">{t('document:participants')}:</Typography>
                    <Typography color={doc.data.participants ? 'default' : 'secondary'}>
                      {doc.data.participants ?? t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography sx={{ whiteSpace: 'nowrap' }} variant="h5">
                      {t('document:matters')}:
                    </Typography>
                    <Typography color={doc.data.matters ? 'default' : 'secondary'}>
                      {doc.data.matters ?? t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography sx={{ whiteSpace: 'nowrap' }} variant="h5">
                      {t('document:schedule')}:
                    </Typography>
                    <Typography color={doc.data.schedule ? 'default' : 'secondary'}>
                      {doc.data.schedule ?? t('common:empty')}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant="h5">{t('document:followupDate')}:</Typography>
                    <Typography color={doc.data.followupDate ? 'default' : 'secondary'}>
                      {(doc.data.followupDate && new Date(doc.data.followupDate).toLocaleDateString('fi-FI')) ??
                        t('common:empty')}
                    </Typography>
                  </div>
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'right' }}>
                  {hasWriteRights && activeProcedure() && doc.active ? (
                    <Button
                      component={Link}
                      data-cy={`accordion-${index}-edit-button`}
                      href={`${basePath}v1/programmes/10/${programmeKey}/document/${doc.id}`}
                      startIcon={<Edit />}
                      variant="contained"
                    >
                      {t('document:edit')}
                    </Button>
                  ) : null}
                  {isAdmin(user) && !doc.data?.date && (
                    <Button
                      color="error"
                      component={Link}
                      data-cy={`accordion-${index}-delete-button`}
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
        {hasWriteRights && activeProcedure() ? (
          <Box>
            <Button
              data-cy="create-new-document"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={() => navigate(`/v1/programmes/${form}/${programmeKey}/document/new`)}
              startIcon={<Add />}
              variant="outlined"
            >
              {t('document:newDocument')}
            </Button>
          </Box>
        ) : null}
      </Box>
      <br />
      {hasAccessToCloseInterventionProcedure() && activeProcedure() && (
        <Alert data-cy="closeInterventionProcedureAlertBox" severity="warning" variant="outlined">
          <Typography sx={{ mb: 2 }} variant="h5">
            {t('document:closeInterventionProcedureHeader')}
          </Typography>
          <Typography variant="light">{t('document:closeInterventionProcedureDescription')}</Typography>
          <FormControl
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: '2rem',
              mb: '2rem',
              mt: '2rem',
            }}
          >
            <InputLabel data-cy="reasonDropdown" sx={{ width: '50%' }}>
              {t('document:dropdownReason')}
            </InputLabel>
            <Select
              data-cy="reasonDropdown"
              label={t('document:dropdownReason')}
              onChange={event => setReason(event.target.value)}
              sx={{ width: '50%' }}
              value={reason}
            >
              <MenuItem value={'1'}>{t('document:option1')}</MenuItem>
              <MenuItem value={'2'}>{t('document:option2')}</MenuItem>
              <MenuItem value={'3'}>{t('document:option3')}</MenuItem>
            </Select>
            {reason === '3' && (
              <TextField
                label={t('document:textfieldReason')}
                onChange={event => setAdditionalInfo(event.target.value)}
                sx={{ width: '65%' }}
                value={additionalInfo}
              />
            )}
          </FormControl>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              color="error"
              data-cy="closeInterventionProcedureButton"
              disabled={!reason}
              onClick={handleCloseProcedure}
              variant="contained"
            >
              {t('document:closeButton')}
            </Button>
          </div>
        </Alert>
      )}
    </Box>
  )
}

export default InterventionComponent
