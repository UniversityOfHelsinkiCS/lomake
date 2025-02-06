import { customColors } from '../../../../theme'

interface TrafficLightProps {
  color: string
  style?: any
}

const getColorHex = (color: string) => {
  switch (color) {
    case 'Vihreä':
      return customColors.greenLight
    case 'Keltainen':
      return customColors.yellowLight
    case 'Punainen':
      return customColors.redLight
    default:
      return customColors.grayLight
  }
}

export const TrafficLight = (props: TrafficLightProps) => {
  const colorHex = getColorHex(props.color)
  const isDisplayed = props.color === 'Tyhjä' ? 'none' : 'block'
  return (
    <div
      style={{
        backgroundColor: colorHex,
        display: isDisplayed,
        minWidth: '25px',
        width: '25px',
        minHeight: '25px',
        height: '25px',
        borderRadius: '50%',
        ...props.style,
      }}
    ></div>
  )
}
