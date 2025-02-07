import { Box, Card, CardActionArea, Typography } from '@mui/material'
import { TrafficLight } from './TrafficLightComponent'
import { calculateColor, calculateValue } from '../Utils/util'
import { useState } from 'react'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataCardData, KeyDataMetadata, KeyDataProgramme } from '@/client/lib/types'

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
  const [showDescription, setShowDescription] = useState(false)

  const handleClick = () => {
    setShowDescription(!showDescription)
  }

  return (
    <Card sx={{ height: 'fit-content' }}>
      <CardActionArea onClick={handleClick}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '15px',
            flexWrap: 'nowrap',
          }}
        >
          <TrafficLight color={props.color} />
          <Typography fontStyle={'italic'}>{props.title}</Typography>
          <Typography fontStyle={'italic'} color={props.value === 'Ei dataa' ? 'textSecondary' : 'textPrimary'}>
            {props.value}
          </Typography>
        </div>

        {showDescription && (
          <Typography variant="body2" color="textSecondary" style={{ padding: '15px' }}>
            {props.description}
          </Typography>
        )}
      </CardActionArea>
    </Card>
  )
}

const KeyDataCard = (props: KeyDataCardProps) => {
  return (
    <Box sx={{ padding: '50px 0' }}>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          paddingBottom: '10px',
        }}
      >
        <TrafficLight color={props.color} style={{ minHeight: '28px', minWidth: '28px' }} />
        <h2 style={{ margin: 0 }}>{props.title.toUpperCase()}</h2>
      </Box>
      <Typography variant="body1" color="textSecondary" style={{ padding: '20px 0 30px 0' }}>
        {props.description}
      </Typography>

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
