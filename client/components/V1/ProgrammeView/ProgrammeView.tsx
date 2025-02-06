import { CircularProgress } from '@mui/material'
import { useFetchSingleKeyData } from '@/client/hooks/useFetchKeyData'
import { useParams } from 'react-router'
import KeyDataCard from '@/client/components/V1/Generic/KeyDataCardComponent'
import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import type { KeyDataCardData } from '@/client/lib/types'

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
