import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress, IconButton } from '@mui/material'
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
  const { i18n } = useTranslation()
  const lang = i18n.language

  const dispatch = useDispatch()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const keyData = useFetchSingleKeyData(programmeKey, lang)
  const form = 10
  const { t } = useTranslation()

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
      {KeyDataPoints.map(data => (
        <KeyDataCard key={data.title} level={level} metadata={metadata} programme={programme} {...data} />
      ))}
      <TextFieldComponent id="testing" />
    </Box>
  )
}

export default ProgrammeView
