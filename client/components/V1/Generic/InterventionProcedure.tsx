import { useParams } from "react-router"
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
  TextField,
} from "@mui/material"
import { useFetchSingleKeyData } from "@/client/hooks/useFetchKeyData"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/client/util/store"
import type { SingleKeyData } from "@/shared/lib/types"
import { GroupKey, ProgrammeLevel } from "@/client/lib/enums"
import { ArrowBack, ExpandMore } from "@mui/icons-material"
import { basePath } from "@/config/common"
import KeyDataCard from "./KeyDataCardComponent"
import { calculateKeyDataColor, getKeyDataPoints } from "../Utils/util"
import { TFunction } from "i18next"
import { TextFieldCard } from "./TextFieldComponent"
import { getReport } from "@/client/util/redux/reportsSlicer"
import { useEffect, useState } from "react"
import { z } from 'zod'

const calculateIntervetionAreas = ({ metadata, programme, level, t }: { metadata: Record<string, any>[], programme: Record<string, any>, level: ProgrammeLevel, t: TFunction }) => {
  let res: string[] = []
  const keyDataPoints = getKeyDataPoints(t)
  Object.values(keyDataPoints).map((point: any) => {
    const color = calculateKeyDataColor(metadata, programme, point.groupKey, level)
    if (color === 'Punainen') res.push(point.groupKey)
  })
  return res
}

const InterventionProcedure = () => {
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const keyData: SingleKeyData = useFetchSingleKeyData(programmeKey)
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'se' | 'en'
  const year = useSelector((state: RootState) => state.filters.keyDataYear)
  const [formData, setFormData] = useState({ title: '', date: '', participants: '', matters: '', schedule: '', followupDate: '' })
  const [errors, setErrors] = useState({ title: '', date: '', participants: '', matters: '', schedule: '', followupDate: '' })

  const level = programmeKey.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI

  useEffect(() => {
    if (keyData) {
      dispatch(getReport({ studyprogrammeKey: programme.koulutusohjelmakoodi, year: year }))
    }
  }, [keyData, year, dispatch])

  if (!keyData) return null

  const { programme, metadata } = keyData

  const areas = calculateIntervetionAreas({ metadata, programme, level, t })

  const handleSubmit = () => {

  }

  const handleChange = () => {

  }

  return (
    <Box sx={{ width: '75%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '2rem', mb: '2rem' }}>
        <IconButton component={Link} href={`${basePath}v1/programmes/10/${programmeKey}`} sx={{ marginRight: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h2">{keyData.programme.koulutusohjelma[lang]} - {new Date().toDateString()}</Typography>
      </Box>
      <Alert severity="info">Alert Here</Alert>
      <Typography variant="h4">{t('Esitiedot')}</Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h5">Arviointialueet</Typography>
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
              <KeyDataCard level={level} metadata={metadata} programme={programme} {...props} />
              <TextFieldCard id={groupKey} t={t} type="Comment" />
            </AccordionDetails>
          )
        })}
      </Accordion>
      {areas.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h5">Kehittämissuunnitelma</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextFieldCard id="Toimenpiteet" t={t} type="Measure" />
            <Button variant="outlined" component={Link} href={`${basePath}v1/programmes/10/${programmeKey}/${year}/`}>Siirry muokkaamaan kehittämissuunnitelmaa</Button>
          </AccordionDetails>
        </Accordion>
      )}
      <Box sx={{ justifyContent: 'left' }}>
        <Typography variant="h3">Toimenpidelomake</Typography>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5">Yleiset tiedot</Typography>
          <TextField
            name={t('title')}
            label={t('title')}
            variant="outlined"
            margin="normal"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
          />
          <Button type="submit" variant="contained" color="primary">Submit</Button>
        </form>
      </Box>
    </Box>
  )
}

export default InterventionProcedure
