import { useMemo, useEffect } from 'react'
import { useFetchSingleKeyData } from '@/client/hooks/useFetchKeyData'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Box, CircularProgress, IconButton, Button, Link, Typography, Accordion, AccordionSummary, AccordionDetails, Alert } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { Add, ArrowBack, Edit } from '@mui/icons-material'
import { basePath, isAdmin } from '@/config/common'
import { KeyDataByCode, KeyDataProgramme } from '@/shared/lib/types'

import { RootState, AppDispatch } from '@/client/util/store'
import ProgrammeKeyDataTable from './ProgrammeKeyDataTableComponent'
import { calculateIntervetionAreas } from '../Generic/InterventionProcedure'
import BreadcrumbComponent from '../Generic/BreadcrumbComponent'
import { createDocument, getDocuments } from '@/client/util/redux/documentsSlicer'

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

  useEffect(() => {
    dispatch(getDocuments({ studyprogrammeKey: programmeKey }))
  }, [])

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
        history.push(`${basePath}v1/programmes/${form}/${programmeKey}/document/${payload.id}`)
      })
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
          <IconButton component={Link} href={`${basePath}v1/overview`} sx={{ marginRight: 2 }}>
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        </Typography>
      </div>
      <ProgrammeKeyDataTable programmeData={programmeData} metadata={metadata} />
      <div>
        <Typography variant='h1' sx={{ mb: '2rem' }}>{t('keyData:qualityControl').toUpperCase()}</Typography>
        <Alert severity='info'><Typography>{t('keyData:notUsed2025')}</Typography></Alert>
      </div>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Typography variant="h1">{t('keyData:interventionProcedure').toUpperCase()} </Typography>
        <Typography variant="light">LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem</Typography>
        <Alert severity='warning'><Typography></Typography></Alert>
        <Typography variant='h3'>{t('keyData:documentingHeader')}</Typography>
        {(areas.length > 0 && hasWriteRights) && (
          <Box>
            <Button onClick={handleClick} variant="outlined">
              <Add />
              {t('document:newDocument')}
            </Button>
          </Box>
        )}
        {Array.isArray(documents) && (documents
          .map((doc: Record<string, any>) => (
            <Accordion key={doc.id}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant='h4'>{doc.data.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant='h5'>{t('document:date')}:</Typography>
                    <Typography>{doc.data.date}</Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant='h5'>{t('document:participants')}:</Typography>
                    <Typography>{doc.data.participants}</Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant='h5'>{t('document:matters')}:</Typography>
                    <Typography>{doc.data.matters}</Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant='h5'>{t('document:schedule')}:</Typography>
                    <Typography>{doc.data.schedule}</Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Typography variant='h5'>{t('document:followupDate')}:</Typography>
                    <Typography>{doc.data.followupDate}</Typography>
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  {hasWriteRights && (
                    <Button variant='contained' component={Link} href={`${basePath}v1/programmes/10/${programmeKey}/document/${doc.id}`} >
                      {t('document:edit')} <Edit sx={{ ml: '1rem' }} />
                    </Button>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          )))}
      </Box>
    </Box >
  )
}

export default ProgrammeHomeView
