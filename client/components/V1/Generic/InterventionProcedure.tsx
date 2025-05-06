import { useParams } from "react-router"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
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
} from "@mui/material"
import { useFetchSingleKeyData } from "@/client/hooks/useFetchKeyData"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/client/util/store"
import type { KeyDataMetadata } from "@/shared/lib/types"
import { GroupKey, ProgrammeLevel } from "@/client/lib/enums"
import { ArrowBack, ExpandMore } from "@mui/icons-material"
import { basePath } from "@/config/common"
import KeyDataCard from "./KeyDataCardComponent"
import { calculateKeyDataColor, getKeyDataPoints } from "../Utils/util"
import { TFunction } from "i18next"
import { TextFieldCard } from "./TextFieldComponent"
import { getReport } from "@/client/util/redux/reportsSlicer"
import DocumentForm from "./DocumentForm"

export const calculateIntervetionAreas = ({ metadata, programme, t }: { metadata: KeyDataMetadata[], programme: Record<string, any>, t: TFunction }) => {
  let res: string[] = []
  const keyDataPoints = getKeyDataPoints(t)
  Object.values(keyDataPoints).map((point: any) => {
    const color = calculateKeyDataColor(metadata, programme, point.groupKey, programme.level as ProgrammeLevel)
    if (color === 'Punainen') res.push(point.groupKey)
  })
  return res
}

const InterventionProcedure = () => {
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const keyData = useFetchSingleKeyData(programmeKey)
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'se' | 'en'
  const year = useSelector((state: RootState) => state.filters.keyDataYear)

  useEffect(() => {
    if (keyData) {
      dispatch(getReport({ studyprogrammeKey: programme.koulutusohjelmakoodi, year: year }))
    }
  }, [dispatch, keyData, year])

  if (!keyData) return null

  const { programme, metadata } = keyData

  const areas = calculateIntervetionAreas({ metadata, programme, t })

  return (
    <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '2rem', mb: '2rem' }}>
        <IconButton component={Link} href={`${basePath}v1/programmes/10/${programmeKey}`} sx={{ marginRight: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h2">{keyData.programme.koulutusohjelma[lang]} - {`${t('document:header')}-${new Date().toLocaleDateString()}`}</Typography>
      </Box>
      <Alert severity="info">{t('document:infobox')}</Alert>
      <Typography variant="h4">{t('document:backgroundInfoHeader')}</Typography>
      <Typography>{t('document:backgroundInfoDescription')}</Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h5">{t('document:keyFigure')}</Typography>
        </AccordionSummary>
        {areas.map((groupKey) => {
          const props = {
            title: groupKey,
            groupKey: groupKey as GroupKey,
            description: '',
            textField: true,
          }
          return (
            <AccordionDetails key={groupKey}>
              <Typography>{t('document:keyFigureDescription')}</Typography>
              <KeyDataCard level={programme.level as ProgrammeLevel} metadata={metadata} programme={programme} {...props} />
              <TextFieldCard id={groupKey} t={t} type="Comment" />
            </AccordionDetails>
          )
        })}
      </Accordion>
      {areas.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h5">{t('keyData:actions')}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextFieldCard id="Toimenpiteet" t={t} type="Measure" />
            <Button sx={{ alignSelf: 'flex-end', mt: '1rem' }} variant="outlined" component={Link} href={`${basePath}v1/programmes/10/${programmeKey}/${year}/`}>Siirry muokkaamaan kehittämissuunnitelmaa</Button>
          </AccordionDetails>
        </Accordion>
      )}
      <DocumentForm programmeKey={programme.koulutusohjelmakoodi} />
    </Box>
  )
}

export default InterventionProcedure
