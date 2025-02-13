import { Tooltip } from '@mui/material'
import { customColors } from '../../../../theme'
import { useTranslation } from 'react-i18next'

interface TrafficLightProps {
  color: string
  style?: any
}

export const TrafficLight = (props: TrafficLightProps) => {
  const { t } = useTranslation()

  const getColorData = (color: string) => {
    switch (color) {
      case 'Vihreä':
        return { hex: customColors.greenLight, color: t('common:green') }
      case 'Keltainen':
        return { hex: customColors.yellowLight, color: t('common:yellow') }
      case 'Punainen':
        return { hex: customColors.redLight, color: t('common:red') }
      default:
        return { hex: customColors.grayLight, color: t('common:gray') }
    }
  }

  const colorData = getColorData(props.color)
  const hex = colorData.hex
  const text = colorData.color
  const isDisplayed = props.color === 'Tyhjä' ? 'none' : 'block'
  return (
    <Tooltip title={text} arrow>
      <div
        style={{
          backgroundColor: hex,
          display: isDisplayed,
          minWidth: '25px',
          width: '25px',
          minHeight: '25px',
          height: '25px',
          borderRadius: '50%',
          ...props.style,
        }}
      ></div>
    </Tooltip>
  )
}
