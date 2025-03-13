import { useEffect, useState } from 'react'
import { customColors } from '@/theme'
import { useTranslation } from 'react-i18next'
import { Tooltip, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

interface ColorMeterProps {
  display: boolean
  value: string
  thresholds: string
  limits: string
  unit: string | undefined
}

/**
 * Linear scaling function. It takes a value and scales it from one range to another.
 * a1 and a2 are the lower and upper bounds of the original range, and b1 and b2 are the lower and upper bounds of the new range.
 *
 * @returns new value in the new range
 */
const linScale = (value: number, a1: number, a2: number, b1: number, b2: number): number => {
  return ((value - a1) / (a2 - a1)) * (b2 - b1) + b1
}

/**
 * Non-uniform scaling function. Purpose built function that scales the value correctly into the meter.
 * value is the number to be fitted in the meter.
 * Thresholds is an array of the threshold values.
 * Returns a number between ranges 0-100%, to be used in positioning the arrow in meter
 *
 * @returns number between 0-100, a position in the color meter
 */
const interpolateToMeter = (value: number, thresholds: number[], order: 'asc' | 'desc'): number => {
  let meterValue: number | null = null

  const min = thresholds[0]
  const max = thresholds[thresholds.length - 1]

  if (value <= (order === 'asc' ? min : max)) {
    meterValue = 0
  } else if (value >= (order === 'asc' ? max : min)) {
    meterValue = 100
  } else {
    const meterFrac = 100 / (thresholds.length - 1) // size of each color in the meter

    if (order === 'asc') {
      for (let i = 1; i < thresholds.length; i++) {
        if (value >= thresholds[i - 1] && value <= thresholds[i]) {
          meterValue = linScale(value, thresholds[i - 1], thresholds[i], meterFrac * (i - 1), meterFrac * i)
        }
      }
    } else {
      for (let i = 1; i < thresholds.length; i++) {
        if (value <= thresholds[i - 1] && value >= thresholds[i]) {
          meterValue = linScale(value, thresholds[i - 1], thresholds[i], meterFrac * (i - 1), meterFrac * i)
        }
      }
    }
  }

  return meterValue
}

/**
 * Checks if the thresholds are either ascending or descending. If none, throws an error.
 *
 * @returns 'asc' | 'desc' | 'error'
 */
const checkOrdering = (thresholds: number[]): 'asc' | 'desc' | 'error' => {
  let asc = true
  let desc = true

  for (let i = 1; i < thresholds.length; i++) {
    if (thresholds[i] < thresholds[i - 1]) {
      asc = false
    } else if (thresholds[i] > thresholds[i - 1]) {
      desc = false
    }
  }

  if (asc) return 'asc'
  if (desc) return 'desc'
  return 'error'
}

export default function ColorMeterComponent({ display, value, thresholds, limits, unit }: ColorMeterProps) {
  const { t } = useTranslation()

  const [thresholdValues, setThresholdValues] = useState<string[]>(['', '', ''])
  const [interpolatedValue, setInterpolatedValue] = useState<number>(50)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (!display || value == 'Ei dataa') return

    const thresholdSplit = thresholds.split(';').map((t: string) => parseFloat(t.replace(',', '.')))
    const order = checkOrdering(thresholdSplit)

    // TODO: CHECKS ARE REDUNDANT AFTER ZOD VALIDATION IMPLEMENTATION
    if (order === 'error') {
      console.error('Thresholds are not in order')
      setError(true)
      return
    }

    if (thresholdSplit.length !== 4) {
      console.error('Thresholds are not in correct format')
      setError(true)
      return
    }

    const redThres = thresholdSplit[0]
    const yellowThres = thresholdSplit[1]
    const lightGreenThres = thresholdSplit[2]
    const darkGreenThres = thresholdSplit[3]

    const limitSplit = limits.split(';').map((t: string) => parseFloat(t.replace(',', '.')))
    const min = limitSplit[0]
    const max = limitSplit[1]

    let thresholdsArr: number[] = []

    if (order === 'asc') {
      thresholdsArr = [min, yellowThres, lightGreenThres, darkGreenThres, max]
    } else if (order === 'desc') {
      thresholdsArr = [max, yellowThres, lightGreenThres, darkGreenThres, min]
    }

    const parsedValue = parseFloat(value.replace(',', '.'))
    const meterValue = interpolateToMeter(parsedValue, thresholdsArr, order)

    setThresholdValues([
      yellowThres.toString() + (unit === '%' ? '%' : ''),
      lightGreenThres.toString() + (unit === '%' ? '%' : ''),
      darkGreenThres.toString() + (unit === '%' ? '%' : ''),
    ])
    setInterpolatedValue(meterValue)
  }, [display, value, thresholds, unit])

  if (!display || value == 'Ei dataa')
    return (
      <div style={{ padding: '2.5rem 0', display: 'flex', justifyContent: 'center' }}>
        <Typography variant="italic" color="textSecondary">
          {t('keyData:colormeterNoDisplay')}
        </Typography>
      </div>
    )

  if (error) {
    return (
      <div style={{ padding: '2.5rem 0', display: 'flex', justifyContent: 'center' }}>
        <Typography variant="lightSmall" color="error">
          {t('keyData:colormeterError')}
        </Typography>
      </div>
    )
  }

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
          <Tooltip title={`${t('common:red')} `} arrow>
            <div style={{ backgroundColor: customColors.redLight, flex: 1 }} />
          </Tooltip>
          <Tooltip title={t('common:yellow')} arrow>
            <div style={{ backgroundColor: customColors.yellowLight, flex: 1 }} />
          </Tooltip>
          <Tooltip title={t('common:lightGreen')} arrow>
            <div style={{ backgroundColor: customColors.lightGreenLight, flex: 1 }} />
          </Tooltip>
          <Tooltip title={t('common:darkGreen')} arrow>
            <div style={{ backgroundColor: customColors.darkGreenLight, flex: 1 }} />
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
            variant="lightSmall"
            sx={{ position: 'absolute', left: `calc(100%/4)`, transform: 'translateX(-50%)' }}
          >
            {thresholdValues[0]}
          </Typography>
          <Typography
            variant="lightSmall"
            sx={{ position: 'absolute', left: `calc((100%/4)*2)`, transform: 'translateX(-50%)' }}
          >
            {thresholdValues[1]}
          </Typography>
          <Typography
            variant="lightSmall"
            sx={{ position: 'absolute', left: `calc((100%/4)*3)`, transform: 'translateX(-50%)' }}
          >
            {thresholdValues[2]}
          </Typography>
        </div>
      </div>
    </div>
  )
}
