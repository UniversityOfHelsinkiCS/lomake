import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, AlertTitle, Box, CircularProgress, IconButton, Typography } from '@mui/material'
import { useFetchSingleKeyData } from '../../../hooks/useFetchKeyData'
import { getReports } from '../../../util/redux/reportsReducer'
import { wsJoinRoom, wsLeaveRoom } from '../../../util/redux/websocketReducer.js'
import { useParams } from 'react-router'
import KeyDataCard from '../Generic/KeyDataCardComponent'
import TextFieldComponent from '../Generic/TextFieldComponent'
import { setViewOnly } from '../../../util/redux/formReducer'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataCardData } from '@/client/lib/types'

const ProgrammeView = () => {
  const lang = useSelector((state: { language: string }) => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const keyData = useFetchSingleKeyData(programmeKey, lang)
  const form = 10

  const level = programmeKey.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI

  useEffect(() => {
    if (!programmeKey) return
    dispatch(getReports(programmeKey))
    dispatch(wsJoinRoom(programmeKey, form))
    dispatch(setViewOnly(false))
  }, [programmeKey, form])

  if (!keyData) {
    return <CircularProgress />
  }

  const { programme, metadata } = keyData

  const KeyDataPoints: KeyDataCardData[] = [
    {
      title: t('keyData:vetovoima'),
      groupKey: GroupKey.VETOVOIMAISUUS,
      description: t('keyData:vetovoimaInfo'),
      color: programme.vetovoimaisuus,
    },
    {
      title: t('keyData:lapivirtaus'),
      groupKey: GroupKey.LAPIVIRTAUS,
      description: t('keyData:lapivirtausInfo'),
      color: programme.lapivirtaus,
    },
    {
      title: t('keyData:palaute'),
      groupKey: GroupKey.OPISKELIJAPALAUTE,
      description: t('keyData:palauteInfo'),
      color: programme.opiskelijapalaute,
    },
    {
      title: t('keyData:resurssit'),
      groupKey: GroupKey.RESURSSIT,
      description: t('keyData:resurssitInfo'),
      color: programme.resurssit,
    },
  ]
  return (
    <Box sx={{ width: '80%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <IconButton component={Link} to="/v1" sx={{ marginRight: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <h3>{programme.koulutusohjelma}</h3>
      </div>

      <Alert severity="info" icon={false} sx={{ marginTop: 4 }}>
        <Typography variant="h6">{t('keyData:title')}</Typography>
        <br />
        <Typography variant="body1">{t('keyData:info1')}</Typography>
        <br />
        <Typography variant="body1">{t('keyData:info2')}</Typography>
        <br />
        <Typography variant="body1">{t('keyData:keyFigureInfo')}</Typography>
        <ul>
          <li>{t('keyData:vetovoima')}</li>
          <li>{t('keyData:lapivirtaus')}</li>
          <li>{t('keyData:palaute')}</li>
          <li>{t('keyData:resurssit')}</li>
        </ul>
        <Typography variant="body1">{t('keyData:criteriaInfo')}</Typography>
      </Alert>

      {KeyDataPoints.map(data => (
        <>
          <KeyDataCard key={data.title} level={level} metadata={metadata} programme={programme} {...data} />
          <TextFieldComponent id={data.title} type="comment" />
        </>
      ))}
    </Box>
  )
}

export default ProgrammeView
