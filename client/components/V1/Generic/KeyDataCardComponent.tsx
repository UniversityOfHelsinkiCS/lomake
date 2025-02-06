import { Box, Card } from '@mui/material'
import { TrafficLight } from './TrafficLightComponent'
import { calculateColor, calculateValue } from '../Utils/util'
import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import type { KeyDataCardData, KeyDataMetadata, KeyDataProgramme } from '@/client/lib/types'

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
  description: string
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
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2,
      }}
    >
      {meta.map(data => {
        const value =
          props.programme.values[
            Object.keys(props.programme.values).find(
              key => key.trim().toLowerCase() === data.kriteerinNimi.trim().toLowerCase(),
            )
          ] || null
        const color = calculateColor(value, data.kynnysarvot, data.liikennevalo)
        const valueText = calculateValue(value, data.yksikko)

        return (
          <CriteriaCard
            key={data.kriteerinNimi}
            title={data.kriteerinNimi}
            description={data.maaritelma}
            value={valueText}
            color={color}
          />
        )
      })}
    </Box>
  )
}

const CriteriaCard = (props: CriteriaCardProps) => {
  return (
    <Card>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '15px',
          flexWrap: 'nowrap',
          width: '100%',
          height: '100%',
        }}
      >
        <TrafficLight color={props.color} />
        <i>{props.title}</i>
        <i>{props.value}</i>
      </div>
    </Card>
  )
}

const KeyDataCard = (props: KeyDataCardProps) => {
  return (
    <Box sx={{ paddingBottom: '30px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', paddingBottom: '10px' }}>
        <TrafficLight color={props.color} />
        <h2>{props.title.toUpperCase()}</h2>
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
