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
import type { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import type { DocumentType } from '@/client/lib/types'
import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { ArrowBack, ExpandMore } from '@mui/icons-material'
import { basePath, isAdmin } from '@/config/common'
import KeyDataCard from './KeyDataCardComponent'
import { calculateKeyDataColor, getKeyDataPoints } from '@/client/util/v1'
import { TFunction } from 'i18next'
import { TextFieldCard } from './TextFieldCard'
import DocumentForm from './DocumentForm'
import { useGetDocumentsQuery } from '@/client/redux/documents'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchSingleKeyDataQuery } from '@/client/redux/keyData'
import { Loader } from 'semantic-ui-react'

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
  if (!metadata || !programme) return res
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
  const { isLoading, programme, metadata } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })
  const lang = useAppSelector(state => state.language) as 'fi' | 'se' | 'en'
  const year = useAppSelector(state => state.filters.keyDataYear)
  const user = useAppSelector(state => state.currentUser.data)
  const { data: documents = [], isFetching } = useGetDocumentsQuery({ studyprogrammeKey: programmeKey })
  const document = (documents.length > 0 || !isFetching) ? documents.find((doc: DocumentType) => doc.id.toString() === id) : null

  const hasWriteRights = (user.access[programmeKey]?.write && user.specialGroup?.evaluationFaculty) || isAdmin(user)

  // For this function the year variable is not needed cuz
  // intervention procedure is independent from years.
  const programmeData = programme.find(
    (programmeData: KeyDataProgramme) => programmeData.koulutusohjelmakoodi === programmeKey,
  )

  if (isLoading || !programmeData) return <Loader active />

  const areas = calculateInterventionAreas({ metadata, programme: programmeData, t })

  if (!programme || !hasWriteRights) return null

  if (isFetching || !document) return <CircularProgress />

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
              <TextFieldCard id={groupKey} t={t} type="Comment" studyprogrammeKey={programmeKey} />
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
            <TextFieldCard id="Toimenpiteet" t={t} type="Measure" studyprogrammeKey={programmeKey} />
            <Button
              sx={{ alignSelf: 'flex-end', mt: '1rem' }}
              variant="outlined"
              component={Link}
              href={`${basePath}v1/programmes/10/${programmeKey}/${year}?tab=1`}
            >
              {t('keyData:moveToAction')}
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
