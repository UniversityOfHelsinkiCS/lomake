/* eslint-disable react/jsx-props-no-spreading */
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Box,
  IconButton,
  Typography,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material'
import type { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import type { DocumentType, ReportDataKey } from '@/client/lib/types'
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
import EditDocument from './EditDocument'
import { Link } from '../../Link'

export const calculateInterventionAreas = ({
  metadata,
  programme,
  t,
  selectedYear,
}: {
  metadata: KeyDataMetadata[]
  programme: KeyDataProgramme
  t: TFunction
  selectedYear: string | number
}) => {
  const res: string[] = []
  if (!metadata || !programme) return res
  const keyDataPoints = getKeyDataPoints(t)
  Object.values(keyDataPoints).map((point: any) => {
    if (`${selectedYear}` === '2025' && point.groupKey === GroupKey.RESURSSIT) return
    const color = calculateKeyDataColor(metadata, programme, point.groupKey, programme.level as ProgrammeLevel)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (color === 'Punainen') res.push(point.groupKey)
  })
  return res
}

const InterventionProcedure = () => {
  const { programme: programmeKey, id } = useParams<{ programme: string; id: string }>()
  const { t } = useTranslation()
  const { isLoading, programme, metadata } = useFetchSingleKeyDataQuery({ studyprogrammeKey: programmeKey })
  const lang = useAppSelector(state => state.language) as 'fi' | 'se' | 'en'
  const selectedYear = useAppSelector(state => state.filters.keyDataYear)
  const user = useAppSelector(state => state.currentUser.data)
  const { data: documents = [], isFetching } = useGetDocumentsQuery({ studyprogrammeKey: programmeKey })
  const document =
    documents.length > 0 || !isFetching ? documents.find((doc: DocumentType) => doc.id.toString() === id) : null

  const hasWriteRights = user.access[programmeKey]?.write ?? isAdmin(user)

  if (isLoading) return <Loader active />
  // For this function the year variable is not needed cuz
  // intervention procedure is independent from years.
  const programmeData = programme.find(
    (programmeData: KeyDataProgramme) => programmeData.koulutusohjelmakoodi === programmeKey
  )

  const year = `${programmeData.year + 1}`

  const areas = calculateInterventionAreas({ metadata, programme: programmeData, t, selectedYear })

  if (!programme || !hasWriteRights) return null

  if (isFetching) return <CircularProgress />

  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '2rem', mb: '1rem' }}>
        <IconButton component={Link} sx={{ marginRight: 2 }} to={`${basePath}v1/programmes/10/${programmeKey}`}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h2">{programmeData.koulutusohjelma[lang]}</Typography>
      </Box>
      <Alert severity="info">
        <Typography style={{ gap: 1 }} variant="light">
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
              <TextFieldCard
                id={groupKey as ReportDataKey}
                studyprogrammeKey={programmeKey}
                t={t}
                type="Comment"
                year={year}
              />
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
            <TextFieldCard id="Toimenpiteet" studyprogrammeKey={programmeKey} t={t} type="Measure" year={year} />
            <Link
              sx={{ alignSelf: 'flex-end', mt: '1rem' }}
              to={`${basePath}v1/programmes/10/${programmeKey}/${year}?tab=1`}
            >
              {t('keyData:moveToAction')}
            </Link>
          </AccordionDetails>
        </Accordion>
      )}
      <br />
      <br />
      {!id ? (
        <DocumentForm programmeKey={programmeData.koulutusohjelmakoodi} />
      ) : (
        <EditDocument document={document} id={id} programmeKey={programmeData.koulutusohjelmakoodi} />
      )}
    </Box>
  )
}

export default InterventionProcedure
