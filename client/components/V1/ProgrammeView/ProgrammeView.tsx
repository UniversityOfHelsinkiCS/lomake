import { CircularProgress } from '@mui/material'
import { useFetchSingleKeyData } from '../../../hooks/useFetchKeyData'
import { useParams } from 'react-router'
import { GroupKey, ProgrammeLevel } from '../enums'
import KeyDataCard from '../Generic/KeyDataCardComponent'

const ProgrammeView = () => {
  const { programme: programmeId } = useParams<{ programme: string }>()
  const keyData = useFetchSingleKeyData(programmeId)

  const level = programmeId.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI

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
    <div>
      <h2>{programme.koulutusohjelma}</h2>
      {KeyDataPoints.map(data => (
        <KeyDataCard key={data.title} level={level} metadata={metadata} programme={programme} {...data} />
      ))}
    </div>
  )
}

export default ProgrammeView
