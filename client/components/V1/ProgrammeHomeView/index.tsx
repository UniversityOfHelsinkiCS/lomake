import { useMemo, useEffect, useState } from 'react'
import { useFetchSingleKeyData } from '@/client/hooks/useFetchKeyData'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Box,
  CircularProgress,
  IconButton,
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
  TextField
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { Add, ArrowBack, Edit } from '@mui/icons-material'
import { basePath, dekanaattiIamGroup, isAdmin } from '@/config/common'
import { KeyDataByCode, KeyDataProgramme } from '@/shared/lib/types'

import { RootState, AppDispatch } from '@/client/util/store'
import ProgrammeKeyDataTable from './ProgrammeKeyDataTableComponent'
import { calculateIntervetionAreas } from '../Generic/InterventionProcedure'
import BreadcrumbComponent from '../Generic/BreadcrumbComponent'
import { closeInterventionProcedure, createDocument, getDocuments } from '@/client/util/redux/documentsSlicer'

const ProgrammeHomeView = () => {
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'en' | 'se'
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const dispatch: AppDispatch = useDispatch()
  const history = useHistory()
  const documents = useSelector((state: RootState) => state.documents.data)
  const user = useSelector((state: RootState) => state.currentUser.data)
  const form = 10
  const startYear = 2024  // The base year of data from which annual follow-up tracking begins

  const keyData: KeyDataByCode = useFetchSingleKeyData(programmeKey)

  const hasWriteRights = (user.access[programmeKey]?.write && user.specialGroup?.evaluationFaculty) || isAdmin(user)

  const [reason, setReason] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  useEffect(() => {

    document.title = `${t('form')} - ${programmeKey}`
    dispatch(getDocuments({ studyprogrammeKey: programmeKey }))
  }, [dispatch, programmeKey])

  const metadata = useMemo(() => {
    return keyData ? keyData.metadata : []
  }, [keyData])

  const programmeData = useMemo(() => {
    if (keyData) {
      return keyData.programme.filter(
        (programmeData: KeyDataProgramme) =>
          programmeData.koulutusohjelmakoodi === programmeKey && programmeData.year >= startYear,
      )
    }
    return []
  }, [keyData])

  if (!keyData) {
    return <CircularProgress />
  }

  const areas = calculateIntervetionAreas({ metadata, programme: programmeData[0], t })

  const handleClick = () => {
    dispatch(createDocument({ studyprogrammeKey: programmeKey, data: null }))
      .then(({ payload }) => {
        history.push(`${basePath}v1/programmes/${form}/${programmeKey}/document/${payload.at(-1).id}`)
      })
  }

  const handleCloseProcedure = () => {
    const data = {
      'reason': reason,
      'additionalInfo': additionalInfo,
    }
    dispatch(closeInterventionProcedure({ studyprogrammeKey: programmeKey, data: data }))
      .then(() => dispatch(getDocuments({ studyprogrammeKey: programmeKey })))
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

  const hasAccessToCloseInterventionProcedure = () => {
    const isUserInDekanaattiGroup = user.iamGroups.some((group: string) => dekanaattiIamGroup.includes(group))
    return isAdmin(user) || isUserInDekanaattiGroup
  }

  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <div style={{ marginTop: '4rem' }}>
        <BreadcrumbComponent
          links={[
            { label: t('keyData:overview'), href: `${basePath}v1/overview` },
            { label: t('keyData:programmeHome'), href: `${basePath}v1/programmes/${form}/${programmeKey}` },
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2rem' }}>
          <IconButton data-cy='navigate-back' component={Link} href={`${basePath}v1/overview`} sx={{ marginRight: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h1">{programmeData[0].koulutusohjelma[lang]}</Typography>
        </div>
      </div>
      <div>
        <Typography variant="h1">
          {t('keyData:homeHeader').toUpperCase()}
        </Typography>
        <Typography style={{ marginTop: '2rem' }}>
          {t('keyData:homeDescription')}
        </Typography>
      </div>
      <ProgrammeKeyDataTable programmeData={programmeData} metadata={metadata} />
      <div>
        <Typography variant='h1' sx={{ mb: '2rem' }}>{t('keyData:qualityControl').toUpperCase()}</Typography>
        <Alert severity='info'><Typography>{t('keyData:notUsed2025')}</Typography></Alert>
      </div>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Typography variant="h1">{t('keyData:interventionProcedure').toUpperCase()} </Typography>
        <Typography variant="light">{t('document:homeDescription')}</Typography>
        <Alert severity={activeProcedure() ? 'warning' : 'success'}>
          <Typography variant='h6'>{activeProcedure() ? t('document:warningTextHeader') : null}</Typography>
          <Typography>{activeProcedure() ? t('document:warningTextDescription') : t('document:successText')}</Typography>
        </Alert>
        <Typography variant='h3'>{t('keyData:documentingHeader')}</Typography>
        <Typography>{t('document:documentingDescription1')}</Typography>
        <Typography>{t('document:documentingDescription2')}</Typography>
        {Array.isArray(documents) && (documents
          .map((doc: Record<string, any>) => (
            <Accordion key={doc.id} sx={{ padding: '2rem' }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant='h3'>{doc.data.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant='h5'>{t('document:date')}:</Typography>
                    <Typography>{doc.data.date && new Date(doc.data.date).toLocaleDateString('fi-FI')}</Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant='h5'>{t('document:participants')}:</Typography>
                    <Typography>{doc.data.participants}</Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', }}>
                    <Typography variant='h5' sx={{ whiteSpace: 'nowrap' }}>{t('document:matters')}:</Typography>
                    <Typography>{doc.data.matters}</Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant='h5' sx={{ whiteSpace: 'nowrap' }}>{t('document:schedule')}:</Typography>
                    <Typography>{doc.data.schedule}</Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant='h5'>{t('document:followupDate')}:</Typography>
                    <Typography>{doc.data.followupDate && new Date(doc.data.followupDate).toLocaleDateString('fi-FI')}</Typography>
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  {(hasWriteRights && activeProcedure() && doc.active) && (
                    <Button variant='contained' component={Link} href={`${basePath}v1/programmes/10/${programmeKey}/document/${doc.id}`} >
                      {t('document:edit')} <Edit sx={{ ml: '1rem' }} />
                    </Button>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          )))}
        {(hasWriteRights && activeProcedure()) && (
          <Box>
            <Button data-cy='create-new-document' onClick={handleClick} variant="outlined">
              <Add />
              {t('document:newDocument')}
            </Button>
          </Box>
        )}
      </Box>
      {(hasAccessToCloseInterventionProcedure && activeProcedure()) && (
        <Alert data-cy='closeInterventionProcedureAlertBox' severity='warning' variant='outlined'>
          <Typography variant='h6'>{t('document:closeInterventionProcedureHeader')}</Typography>
          <Typography>{t('document:closeInterventionProcedureDescription')}</Typography>
          <FormControl sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '2rem', mb: '2rem', mt: '2rem' }}>
            <InputLabel data-cy='reasonDropdown' sx={{ width: '50%' }}>{t('document:dropdownReason')}</InputLabel>
            <Select data-cy='reasonDropdown' value={reason} label={t('document:dropdownReason')} onChange={(event) => setReason(event.target.value)} sx={{ width: '50%' }}>
              <MenuItem value={'1'}>{t('document:option1')}</MenuItem>
              <MenuItem value={'2'}>{t('document:option2')}</MenuItem>
              <MenuItem value={'3'}>{t('document:option3')}</MenuItem>
            </Select>
            {reason === '3' && (<TextField sx={{ width: '65%' }} label={t('document:textfieldReason')} value={additionalInfo} onChange={(event) => setAdditionalInfo(event.target.value)} />)}
          </FormControl>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button data-cy='closeInterventionProcedureButton' variant='contained' onClick={handleCloseProcedure} color='error' disabled={!(reason && documents.length > 0)}>{t('document:closeButton')}</Button>
          </div>
        </Alert>
      )}
    </Box >
  )
}

export default ProgrammeHomeView
