import { Box, Card, CircularProgress } from '@mui/material'
import { useFetchSingleKeyData } from '../../hooks/useFetchKeyData'
import { useParams } from 'react-router'
import { GroupKey, ProgrammeLevel } from './enums'
import { TrafficLight } from './Generic/TrafficLightComponent'

interface KeyDataCardData {
  title: string
  groupKey: GroupKey
  description: string
  color: string
}

interface KeyDataCardProps extends KeyDataCardData {
  level: ProgrammeLevel
  metadata: KeyDataMetadata[]
  programme: KeyDataProgramme
}

interface CriteriaGroupProps {
  programme: KeyDataProgramme
  groupKey: GroupKey
  level: ProgrammeLevel
  metadata: KeyDataMetadata[]
}

interface CriteriaCardProps {
  title: string
  value: number
  color: string
}

const calculateColor = (value: number, threshold: string) => {
  const [first, second] = threshold.split(';').map(Number)

  if (!value) {
    return 'Harmaa'
  }

  if (first === 0) {
    if (value === 0) {
      return 'Punainen'
    } else if (value < second) {
      return 'Keltainen'
    } else {
      return 'Vihreä'
    }
  } else {
    if (value > first) {
      return 'Punainen'
    } else if (value > second) {
      return 'Keltainen'
    } else {
      return 'Vihreä'
    }
  }
}

const CriteriaGroup = (props: CriteriaGroupProps) => {
  const meta = props.metadata.filter(data => data.avainluku === props.groupKey && data.ohjelmanTaso === props.level)

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
        gap: 2,
      }}
    >
      {meta.map(data => {
        const value = props.programme.values[data.kriteerinNimi]
        const color = calculateColor(value, data.kynnysarvot)
        return <CriteriaCard key={data.kriteerinNimi} title={data.kriteerinNimi} value={value} color={color} />
      })}
    </Box>
  )
}

const CriteriaCard = (props: CriteriaCardProps) => {
  return (
    <Card>
      <TrafficLight color={props.color} />
      <p>{props.title}</p>
      <p>{props.value?.toFixed(2) ?? 'Ei dataa'}</p>
      <br />
    </Card>
  )
}

const KeyDataCard = (props: KeyDataCardProps) => {
  return (
    <>
      <TrafficLight color={props.color} />
      <h3>{props.title}</h3>
      <p>{props.description}</p>

      <CriteriaGroup
        groupKey={props.groupKey}
        level={props.level}
        metadata={props.metadata}
        programme={props.programme}
      />
    </>
  )
}

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
