import { Tooltip } from '@mui/material'
import { customColors } from '../../../../theme'
import { useTranslation } from 'react-i18next'
import { LightColors } from '@/client/lib/enums'

interface TrafficLightProps {
  color: string
  style?: any
  variant?: 'small' | 'medium' | 'large'
}

export const TrafficLight = (props: TrafficLightProps) => {
  const { t } = useTranslation()

  const getColorData = (color: string) => {
    switch (color) {
      case LightColors.LightGreen:
        return { hex: customColors.lightGreenLight, color: t('common:lightGreen') }
      case LightColors.DarkGreen:
        return { hex: customColors.darkGreenLight, color: t('common:darkGreen') }
      case LightColors.Yellow:
        return { hex: customColors.yellowLight, color: t('common:yellow') }
      case LightColors.Red:
        return { hex: customColors.redLight, color: t('common:red') }
      default:
        return { hex: customColors.grayLight, color: t('common:gray') }
    }
  }

  const getSize = (variant: 'small' | 'medium' | 'large' = 'small') => {
    switch (variant) {
      case 'small':
        return '25px'
      case 'medium':
        return '32px'
      case 'large':
        return '38px'
      default:
        return '25px'
    }
  }

  const colorData = getColorData(props.color)
  const hex = colorData.hex
  const text = colorData.color
  const isDisplayed = props.color === 'Tyhjä' ? 'none' : 'block'
  const size = getSize(props.variant)

  return (
    <Tooltip title={text} arrow>
      <div
        style={{
          backgroundColor: hex,
          display: isDisplayed,
          minWidth: size,
          width: size,
          minHeight: size,
          height: size,
          borderRadius: '50%',
          ...props.style,
        }}
      ></div>
    </Tooltip>
  )
}
