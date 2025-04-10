import { isInteger } from 'lodash'
import { TFunction } from 'i18next'
import { GroupKey, LightColors, ProgrammeLevel } from '@/client/lib/enums'
import type { KeyDataProgramme, KeyDataMetadata } from '@/shared/lib/types'

export const calculateColor = (value: number, threshold: string, liikennevalo: boolean, unit?: string) => {
  if (!liikennevalo) {
    return LightColors.Empty
  } else if (!value || !threshold) {
    return LightColors.Grey
  }

  if (unit) {
    value = value * 100
  }

  const [first, second, third, fourth] = threshold
    .split(';')
    .map(str => str.replace(',', '.'))
    .map(Number)

  if (first === 0) {
    if (value < second) {
      return LightColors.Red
    } else if (value < third) {
      return LightColors.Yellow
    } else if (value < fourth) {
      return LightColors.LightGreen
    } else if (value >= fourth) {
      return LightColors.DarkGreen
    } else {
      return LightColors.Grey
    }
  } else {
    if (value > second) {
      return LightColors.Red
    } else if (value > third) {
      return LightColors.Yellow
    } else if (value < third && value > fourth) {
      return LightColors.LightGreen
    } else if (value <= fourth) {
      return LightColors.DarkGreen
    } else {
      return LightColors.Grey
    }
  }
}

export const calculateKeyDataColor = (
  metadata: KeyDataMetadata[],
  programme: KeyDataProgramme,
  groupKey: GroupKey,
  level: ProgrammeLevel,
) => {
  const evaluationArea = metadata.filter(data => 
    data.arviointialue === groupKey && data.ohjelmanTaso === level
  )
  
  // Return Grey if not enough data points
  if (evaluationArea.length < 2) {
    return LightColors.Grey
  }

  const colorsCount = {
    [LightColors.Red]: 0,
    [LightColors.Yellow]: 0,
    [LightColors.LightGreen]: 0,
    [LightColors.DarkGreen]: 0,
    [LightColors.Grey]: 0,
    [LightColors.Empty]: 0,
  }

  // Count missing data points and collect color counts
  let missingCount = 0
  
  evaluationArea.forEach(data => {
    const value = extractKeyDataValue(programme, data)
    if (value === null) {
      missingCount++
      return
    }
    
    const color = calculateColor(value, data.kynnysarvot, data.liikennevalo, data.yksikko)
    colorsCount[color]++
  })

  // If 2 or more key data points are missing, return Grey
  if (missingCount >= 2) {
    return LightColors.Grey
  }

  // If exactly 1 key data point is missing, treat it as DarkGreen
  if (missingCount === 1) {
    colorsCount[LightColors.DarkGreen]++
  }
  
  // Determine final color based on the distribution of colors
  switch (true) {
    case colorsCount[LightColors.Red] >= 2:
      return LightColors.Red
    
    case colorsCount[LightColors.Yellow] >= 2 || colorsCount[LightColors.Red] === 1:
      return LightColors.Yellow
    
    case colorsCount[LightColors.DarkGreen] >= 3 && colorsCount[LightColors.Red] === 0:
      return LightColors.DarkGreen
    
    case colorsCount[LightColors.LightGreen] >= 3 || 
         (colorsCount[LightColors.DarkGreen] >= 1 && colorsCount[LightColors.Red] === 0):
      return LightColors.LightGreen
    
    default:
      return LightColors.Grey
  }
}

export const extractKeyDataValue = (programme: KeyDataProgramme, data: KeyDataMetadata) => {
  return (
    programme.values[
      Object.keys(programme.values).find(key => key.trim().toLowerCase() === data.avainluvunArvo.trim().toLowerCase())
    ] || null
  )
}

export const calculateValue = (value: number, unit?: string) => {
  if (!value) {
    return 'Ei dataa'
  } else if (unit) {
    return `${(value * 100).toFixed(0)} ${unit}`
  } else {
    if (isInteger(value)) {
      return value.toString()
    }
    return value.toFixed(2)
  }
}

export const getKeyDataPoints = (t: TFunction, programme: KeyDataProgramme) => {
  const KeyDataPoints = Object.keys(GroupKey)
    .map((key: string) => {
      const lowerKey = key.toLowerCase()
      return [
        // Type-safe access to the enum value
        GroupKey[key as keyof typeof GroupKey],
        {
          title: t(`keyData:${lowerKey}`),
          groupKey: GroupKey[key as keyof typeof GroupKey],
          description: t(`keyData:${lowerKey}Info`),
          color: programme[lowerKey as keyof typeof programme],
          textField: lowerKey !== 'resurssit', // resurssit section not active in 2025 pilot, this should be removed later
        },
      ]
    })
    .reduce(
      (acc, [key, value]) => {
        acc[key as string] = value
        return acc
      },
      {} as Record<string, any>,
    )

  return KeyDataPoints
}
