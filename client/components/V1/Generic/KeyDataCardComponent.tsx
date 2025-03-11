import { useState} from 'react'
import { useSelector } from 'react-redux'
import { Box, Card, CardActionArea, Typography } from '@mui/material'
import { calculateColor, calculateValue } from '../Utils/util'

import { TrafficLight } from './TrafficLightComponent'
import ColorMeterComponent from './ColorMeterComponent'

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
  hasTrafficLight: boolean
  value: string
  thresholds: string
  unit: string
  color: string
}

const CriteriaGroup = (props: CriteriaGroupProps) => {
  const lang = useSelector((state: { language: string }) => state.language)

  const meta = props.metadata.filter(data => data.arviointialue === props.groupKey && data.ohjelmanTaso === props.level)
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
              key => key.trim().toLowerCase() === data.avainluvunArvo.trim().toLowerCase(),
            )
          ] || null
        const color = calculateColor(value, data.kynnysarvot, data.liikennevalo, data.yksikko)
        const valueText = calculateValue(value, data.yksikko)

        return (
          <CriteriaCard
            key={data.avainluvunNimi[lang]}
            title={data.avainluvunNimi[lang]}
            description={data.maaritelma}
            hasTrafficLight={data.liikennevalo}
            value={valueText}
            thresholds={data.kynnysarvot}
            unit={data.yksikko}
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
            padding: '18px',
            flexWrap: 'nowrap',
          }}
        >
          <TrafficLight style={{ marginRight: '5px' }} color={props.color} />

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="italic">{props.title}</Typography>
            <Typography
              variant="italic"
              style={{ whiteSpace: 'nowrap' }}
              color={props.value === 'Ei dataa' ? 'textSecondary' : ''}
            >
              {props.value}
            </Typography>
          </div>
        </div>

        {showDescription && (
          <div style={{ padding: '15px' }}>
            <Typography variant="lightSmall">{props.description}</Typography>

            <ColorMeterComponent
              display={props.hasTrafficLight}
              value={props.value}
              thresholds={props.thresholds}
              unit={props.unit}
            />
          </div>
        )}
      </CardActionArea>
    </Card>
  )
}

const KeyDataCard = (props: KeyDataCardProps) => {
  return (
    <Box sx={{ padding: '2rem 0' }}>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          paddingBottom: '10px',
        }}
      >
        <TrafficLight color={props.color} variant="large" />
        <Typography variant="h2" style={{ margin: 0 }}>
          {props.title.toUpperCase()}
        </Typography>
      </Box>

      <Box sx={{ padding: '10px 0 30px 0' }}>
        <Typography variant="light">{props.description}</Typography>
      </Box>
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
