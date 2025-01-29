import { customColors } from '../../../../theme'

interface TrafficLightProps {
  color: string
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
  return <div style={{ backgroundColor: colorHex, width: '25px', height: '25px', borderRadius: '50%' }}></div>
}
