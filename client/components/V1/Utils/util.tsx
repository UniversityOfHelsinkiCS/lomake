import { isInteger } from 'lodash'
import { TFunction } from 'i18next'
import { GroupKey } from '@/client/lib/enums'
import type { KeyDataProgramme } from '@/client/lib/types'
import { useMemo } from 'react'

export const calculateColor = (value: number, threshold: string, liikennevalo: boolean) => {
  return useMemo(() => {
    if (!liikennevalo) {
      return 'Tyhjä'
    } else if (!value || !threshold) {
      return 'Harmaa'
    }

    const [first, second, third] = threshold
      .split(';')
      .map(str => str.replace(',', '.'))
      .map(Number)

    if (first === 0) {
      if (value < second) {
        return 'Punainen'
      } else if (value < third) {
        return 'Keltainen'
      } else if (value >= third) {
        return 'Vihreä'
      } else {
        return 'Harmaa'
      }
    } else {
      if (value >= first) {
        return 'Punainen'
      } else if (value >= second) {
        return 'Keltainen'
      } else if (value < second) {
        return 'Vihreä'
      } else {
        return 'Harmaa'
      }
    }
  }, [value, threshold, liikennevalo])
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
