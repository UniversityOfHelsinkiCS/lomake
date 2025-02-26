import { useEffect, useState } from 'react'
import { customColors } from '@/theme'
import { useTranslation } from 'react-i18next'
import { Tooltip, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

interface ColorMeterProps {
  display: boolean
  value: string
  thresholds: string
  unit: string | undefined
}

/**
 * Linear scaling function. It takes a value and scales it from one range to another.
 * a1 and a2 are the lower and upper bounds of the original range, and b1 and b2 are the lower and upper bounds of the new range.
 *
 * @returns new value in the new range
 */
const linScale = (value: number, a1: number, a2: number, b1: number, b2: number) => {
  const ans = ((value - a1) / (a2 - a1)) * (b2 - b1) + b1
  console.log('ans', ans)
  return ans
}

/**
 * Non-uniform scaling function. Purpose built function that scales the value correctly into the meter.
 * value is the number to be fitted in the meter.
 * Thresholds is an array of the threshold values.
 * Returns a number between ranges 0-100%, to be used in positioning the arrow in meter
 *
 * @returns number between 0-100%, a position in the range meter
 */
const interpolateToMeter = (value: number, thresholds: number[]) => {
  const meterFrac = 100 / (thresholds.length - 1) // size of each color in the meter
  for (let i = 1; i < thresholds.length; i++) {
    if (value >= thresholds[i - 1] && value <= thresholds[i]) {
      return linScale(value, thresholds[i - 1], thresholds[i], meterFrac * (i - 1), meterFrac * i)
    }
  }
}

export default function ColorMeterComponent({ display, value, thresholds, unit }: ColorMeterProps) {
  const { t } = useTranslation()

  const [lowerThreshold, setLowerThreshold] = useState<string>('')
  const [upperThreshold, setUpperThreshold] = useState<string>('')
  const [interpolatedValue, setInterpolatedValue] = useState<number>(50)

  useEffect(() => {
    if (!display) return

    const thresholdSplit = thresholds.split(';').map((t: string) => parseFloat(t.replace(',', '.')))

    const base = 0
    const yellowThres = unit === '%' ? thresholdSplit[1] * 100 : thresholdSplit[1]
    const greenThres = unit === '%' ? thresholdSplit[2] * 100 : thresholdSplit[2]
    const max = unit === '%' ? 100 : 1000 // 1000 is an arbitrary adhoc solution for thresholds without maximum

    const parsedValue = parseFloat(value.replace(',', '.'))
    const thresholdsArr = [base, yellowThres, greenThres, max]
    const scaledValue = interpolateToMeter(parsedValue, thresholdsArr)

    setLowerThreshold(yellowThres.toString() + (unit === '%' ? '%' : ''))
    setUpperThreshold(greenThres.toString() + (unit === '%' ? '%' : ''))
    setInterpolatedValue(scaledValue)
  }, [display])

  if (!display) return null

  return (
    <div style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'center' }}>
      {/* Meter container */}
      <div style={{ width: '60%' }}>
        {/* Meter pointer */}
        {/* Width of 0 is a trick to make the arrow point exactly to the value regardless of its dimensions */}
        <div style={{ width: 0, height: 25, position: 'relative', left: `calc(${interpolatedValue}%)` }}>
          <ArrowDropDownIcon fontSize="large" sx={{ transform: 'translateX(-50%)', position: 'absolute' }} />
        </div>

        {/* Meter */}
        <div
          style={{
            height: 25,
            width: '100%',
            borderRadius: 25,
            overflow: 'hidden',
            display: 'flex',
            position: 'relative',
          }}
        >
          <Tooltip title={t('common:red')} arrow>
            <div style={{ backgroundColor: customColors.redLight, flex: 1 }} />
          </Tooltip>
          <Tooltip title={t('common:yellow')} arrow>
            <div style={{ backgroundColor: customColors.yellowLight, flex: 1 }} />
          </Tooltip>
          <Tooltip title={t('common:green')} arrow>
            <div style={{ backgroundColor: customColors.greenLight, flex: 1 }} />
          </Tooltip>

          {/* Inset shadow */}
          <div
            style={{
              position: 'absolute',
              boxShadow: 'inset 0 4px 4px rgba(0,0,0,0.25)',
              inset: 0,
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Threshold values */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: 5,
            fontSize: '0.8rem',
            position: 'relative',
          }}
        >
          <Typography
            variant="body1"
            color="textSecondary"
            fontSize="small"
            sx={{ position: 'absolute', left: `calc(100%/3)`, transform: 'translateX(-50%)' }}
          >
            {lowerThreshold}
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            fontSize="small"
            sx={{ position: 'absolute', left: `calc((100%/3)*2)`, transform: 'translateX(-50%)' }}
          >
            {upperThreshold}
          </Typography>
        </div>
      </div>
    </div>
  )
}
