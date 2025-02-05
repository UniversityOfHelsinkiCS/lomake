import { Box, Card } from '@mui/material'
import { GroupKey, ProgrammeLevel } from '../enums'
import { TrafficLight } from './TrafficLightComponent'
import { calculateColor, calculateValue } from '../Utils/util'

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
  value: string
  color: string
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
        const valueText = calculateValue(value, data.yksikko)

        return <CriteriaCard key={data.kriteerinNimi} title={data.kriteerinNimi} value={valueText} color={color} />
      })}
    </Box>
  )
}

const CriteriaCard = (props: CriteriaCardProps) => {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', paddingBottom: '10px' }}>
        <TrafficLight color={props.color} />
        <p>{props.title}</p>
        <p>{props.value}</p>
      </div>
    </Card>
  )
}

const KeyDataCard = (props: KeyDataCardProps) => {
  return (
    <Box>
      <div style={{ display: 'flex', padding: '10px', alignItems: 'baseline', gap: '5px' }}>
        <TrafficLight color={props.color} />
        <h2>{props.title}</h2>
      </div>
      <p>{props.description}</p>

      <CriteriaGroup
        groupKey={props.groupKey}
        level={props.level}
        metadata={props.metadata}
        programme={props.programme}
      />
    </Box>
  )
}

export default KeyDataCard
