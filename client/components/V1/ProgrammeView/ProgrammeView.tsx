import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress, IconButton } from '@mui/material'
import { useFetchSingleKeyData } from '../../../hooks/useFetchKeyData'
import { getReports } from '../../../util/redux/reportsReducer'
import { wsJoinRoom, wsLeaveRoom } from '../../../util/redux/websocketReducer.js'
import { useParams } from 'react-router'
import { GroupKey, ProgrammeLevel } from '../enums'
import KeyDataCard from '../Generic/KeyDataCardComponent'
import TextFieldComponent from '../Generic/TextFieldComponent'
import { setViewOnly } from '../../../util/redux/formReducer'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const ProgrammeView = () => {
  const dispatch = useDispatch()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const keyData = useFetchSingleKeyData(programmeKey)
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
      title: 'Vetovoimaisuus',
      groupKey: GroupKey.VETOVOIMAISUUS,
      description: 'Avainluvun kuvaus',
      color: programme.vetovoimaisuus,
    },
    {
      title: 'Läpivirtaus ja Valmistuminen',
      groupKey: GroupKey.LAPIVIRTAUS,
      description: 'Avainluvun kuvaus',
      color: programme.lapivirtaus,
    },
    {
      title: 'Opiskelijapalaute ja Työllistyminen',
      groupKey: GroupKey.OPISKELIJAPALAUTE,
      description: 'Avainluvun kuvaus',
      color: programme.opiskelijapalaute,
    },
    {
      title: 'Resurssit',
      groupKey: GroupKey.RESURSSIT,
      description: 'Avainluvun kuvaus',
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
