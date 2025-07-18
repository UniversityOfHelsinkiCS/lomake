import { useState } from 'react'
import { Box, Card, CardActionArea, Tooltip, Typography } from '@mui/material'
import { calculateColor, calculateValue, calculateKeyDataColor, extractKeyDataValue } from '@/client/util/v1'

import { TrafficLight } from './TrafficLightComponent'
import ColorMeterComponent from './ColorMeterComponent'
import ColorHistoryComponent from './ColorHistoryComponent'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import type { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import type { KeyDataCardData } from '@/client/lib/types'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/client/util/hooks'

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
  limits: string
  unit: string
  color: string
  programme: KeyDataProgramme
}

const CriteriaGroup = (props: CriteriaGroupProps) => {
  const lang = useAppSelector(state => state.language) as 'fi' | 'se' | 'en'

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
        const value = extractKeyDataValue(props.programme, data)
        const color = calculateColor(value, data.kynnysarvot, data.liikennevalo, data.yksikko)
        const valueText = calculateValue(value, data.yksikko)

        return (
          <CriteriaCard
            key={data.avainluvunNimi[lang]}
            title={data.avainluvunNimi[lang]}
            description={data.maaritelma[lang]}
            hasTrafficLight={data.liikennevalo}
            value={valueText}
            thresholds={data.kynnysarvot}
            limits={data.mittarinRajat}
            unit={data.yksikko}
            color={color}
            {...props}
          />
        )
      })}
    </Box>
  )
}

const CriteriaCard = (props: CriteriaCardProps) => {
  const [showDescription, setShowDescription] = useState(false)
  const { t } = useTranslation()

  const handleClick = () => {
    setShowDescription(!showDescription)
  }

  const cardContent = (
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
          data-cy={`${props.title}-${props.color}`}
        >
          <TrafficLight style={{ marginRight: '5px' }} color={props.color} />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="italic">{props.title}</Typography>
            <Typography
              variant="italic"
              style={{ whiteSpace: 'nowrap', color: props.value === 'Ei dataa' ? 'textSecondary' : undefined }}
            >
              {props.value === 'Ei dataa' ? t('keyData:noData') : props.value}
            </Typography>
          </div>
        </div>
        {showDescription && (
          <div style={{ padding: '15px' }}>
            <Typography variant="lightSmall">{props.description}</Typography>
            <ColorMeterComponent
              year={props.programme.year}
              display={props.hasTrafficLight}
              value={props.value}
              thresholds={props.thresholds}
              limits={props.limits}
              unit={props.unit}
            />
            <ColorHistoryComponent {...props} />
          </div>
        )}
      </CardActionArea>
    </Card>
  )

  return showDescription ? (
    cardContent
  ) : (
    <Tooltip title={t('keyData:seeMore')} placement="top" arrow>
      {cardContent}
    </Tooltip>
  )
}
const KeyDataCard = (props: KeyDataCardProps) => {
  const color = calculateKeyDataColor(props.metadata, props.programme, props.groupKey, props.level)
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
        <div data-cy={`${props.programme.koulutusohjelmakoodi}-${props.groupKey}-${color}`}>
          <TrafficLight color={color} variant="large" />
        </div>

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
