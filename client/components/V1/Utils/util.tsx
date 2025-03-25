import { isInteger } from 'lodash'
import { TFunction } from 'i18next'
import { GroupKey, LightColors } from '@/client/lib/enums'
import type { KeyDataProgramme } from '@/client/lib/types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const calculateColor = (value: number, threshold: string, liikennevalo: boolean, unit?: string) => {
  return useMemo(() => {
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

export const useNotificationUtils = () => {
  const reports = useSelector((state: { reports: any }) => state.reports.dataForYear)

  const renderTrafficLightBadge = (programmeData: KeyDataProgramme, groupKey: GroupKey) => {
    const isRed = programmeData.redLights?.includes(groupKey)
    const isYellow = programmeData.yellowLights?.includes(groupKey)
    const hasReport = reports?.[programmeData.koulutusohjelmakoodi]?.[groupKey]?.length > 0

    return (isRed || isYellow) && !hasReport
  }
  const renderActionsBadge = (programmeData: KeyDataProgramme, includeReport: boolean = false) => {
    const hasRedLights = programmeData.redLights?.length > 0
    const hasReport = reports?.[programmeData.koulutusohjelmakoodi]?.['Toimenpiteet']?.length > 0

    return {
      showBadge: hasRedLights && !hasReport,
      showIcon: includeReport && hasReport,
    }
  }

  return {
    renderTrafficLightBadge,
    renderActionsBadge,
  }
}
