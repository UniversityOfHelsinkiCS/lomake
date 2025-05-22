import { useParams } from 'react-router'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  IconButton,
  Typography,
  Link,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
} from '@mui/material'
import { useFetchSingleKeyData } from '@/client/hooks/useFetchKeyData'
import type { KeyDataByCode, KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { ArrowBack, ExpandMore } from '@mui/icons-material'
import { basePath, isAdmin } from '@/config/common'
import KeyDataCard from './KeyDataCardComponent'
import { calculateKeyDataColor, getKeyDataPoints } from '../Utils/util'
import { TFunction } from 'i18next'
import { TextFieldCard } from './TextFieldComponent'
import { getReport } from '@/client/util/redux/reportsSlicer'
import DocumentForm from './DocumentForm'
import { getDocuments } from '@/client/util/redux/documentsSlicer'
import { useAppDispatch, useAppSelector } from '@/client/util/hooks'

export const calculateInterventionAreas = ({
  metadata,
  programme,
  t,
}: {
  metadata: KeyDataMetadata[]
  programme: KeyDataProgramme
  t: TFunction
}) => {
  let res: string[] = []
  const keyDataPoints = getKeyDataPoints(t)
  Object.values(keyDataPoints).map((point: any) => {
    const color = calculateKeyDataColor(metadata, programme, point.groupKey, programme.level as ProgrammeLevel)
    if (color === 'Punainen') res.push(point.groupKey)
  })
  return res
}

const InterventionProcedure = () => {
  const { programme: programmeKey, id } = useParams<{ programme: string; id: string }>()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const keyData: KeyDataByCode = useFetchSingleKeyData(programmeKey)
  const lang = useAppSelector(state => state.language) as 'fi' | 'se' | 'en'
  const year = useAppSelector(state => state.filters.keyDataYear)
  const user = useAppSelector(state => state.currentUser.data)
  const documents = useAppSelector(state => state.documents.data)
  const document = documents.length > 0 ? documents.find(doc => doc.id.toString() === id) : null

  const hasWriteRights = (user.access[programmeKey]?.write && user.specialGroup?.evaluationFaculty) || isAdmin(user)

  useEffect(() => {
    if (programmeKey) {
      dispatch(getReport({ studyprogrammeKey: programmeKey, year: year }))
      dispatch(getDocuments({ studyprogrammeKey: programmeKey }))
    }
  }, [programmeKey, year])

  const metadata = useMemo(() => {
    return keyData ? keyData.metadata : []
  }, [keyData])

  // For this function the year variable is not needed cuz
  // intervention procedure is independent from years.
  const programmeData = useMemo(() => {
    if (keyData) {
      return keyData.programme.find(
        (programmeData: KeyDataProgramme) => programmeData.koulutusohjelmakoodi === programmeKey,
      )
    }
    return {}
  }, [keyData, year])

  const areas = calculateInterventionAreas({ metadata, programme: programmeData, t })

  if (!keyData || !hasWriteRights) return null

  if (documents.length === 0) return <CircularProgress />

  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '2rem', mb: '1rem' }}>
        <IconButton component={Link} href={`${basePath}v1/programmes/10/${programmeKey}`} sx={{ marginRight: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h2">
          {programmeData.koulutusohjelma[lang]} - {`${document.data.title}`}
        </Typography>
      </Box>
      <Alert severity="info">
        <Typography variant="light" style={{ gap: 1 }}>
          {t('document:infobox')}
        </Typography>
      </Alert>
      <Typography variant="h3">{t('document:backgroundInfoHeader')}</Typography>
      <Typography variant="light">{t('document:backgroundInfoDescription')}</Typography>
      <Accordion sx={{ padding: '2rem' }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h4">{t('document:keyFigure')}</Typography>
        </AccordionSummary>
        {areas.map(groupKey => {
          const props = {
            title: groupKey,
            groupKey: groupKey as GroupKey,
            description: '',
            textField: true,
          }
          return (
            <AccordionDetails key={groupKey}>
              <Typography>{t('document:keyFigureDescription')}</Typography>
              <KeyDataCard
                level={programmeData.level as ProgrammeLevel}
                metadata={metadata}
                programme={programmeData}
                {...props}
              />
              <TextFieldCard id={groupKey} t={t} type="Comment" />
            </AccordionDetails>
          )
        })}
      </Accordion>
      {areas.length > 0 && (
        <Accordion sx={{ padding: '2rem' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h4">{t('keyData:actions')}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextFieldCard id="Toimenpiteet" t={t} type="Measure" />
            <Button
              sx={{ alignSelf: 'flex-end', mt: '1rem' }}
              variant="outlined"
              component={Link}
              href={`${basePath}v1/programmes/10/${programmeKey}/${year}?tab=1`}
            >
              Siirry muokkaamaan kehittämissuunnitelmaa
            </Button>
          </AccordionDetails>
        </Accordion>
      )}
      <br />
      <br />
      <DocumentForm programmeKey={programmeData.koulutusohjelmakoodi} id={id} document={document} />
    </Box>
  )
}

export default InterventionProcedure
