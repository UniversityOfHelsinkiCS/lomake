import { useSelector } from 'react-redux'
import { GroupKey, LightColors, ProgrammeLevel } from '@/client/lib/enums'
import type { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import { calculateKeyDataColor } from '../components/V1/Utils/util'

export const useNotificationBadge = () => {
  const reports = useSelector((state: { reports: any }) => state.reports.dataForYear)

  const renderTabBadge = (programmeData: KeyDataProgramme, metadata: KeyDataMetadata[]) => {
    const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI

    if (programmeData.additionalInfo && programmeData.additionalInfo?.fi?.includes('Lakkautettu')) {
      return false
    }

    for (const key of Object.keys(GroupKey)) {
      const groupKey = GroupKey[key as keyof typeof GroupKey]

      const color = calculateKeyDataColor(metadata, programmeData, groupKey, level)

      if (renderTrafficLightBadge(programmeData, groupKey, color)) {
        return true
      }
    }
    return false
  }

  const renderTrafficLightBadge = (programmeData: KeyDataProgramme, groupKey: GroupKey, color: LightColors) => {
    if (programmeData.additionalInfo && programmeData.additionalInfo?.fi?.includes('Lakkautettu')) {
      return false
    }

    const hasReport = reports?.[programmeData.koulutusohjelmakoodi]?.[groupKey]?.length > 0
    return (color == LightColors.Red || color == LightColors.Yellow) && !hasReport
  }

  const renderActionsBadge = (
    programmeData: KeyDataProgramme,
    metadata: KeyDataMetadata[],
    includeReport: boolean = false,
  ) => {
    const redLights = []

    if (programmeData.additionalInfo && programmeData.additionalInfo?.fi?.includes('Lakkautettu')) {
      return {
        showBadge: false,
        showIcon: false,
      }
    }

    for (const key of Object.keys(GroupKey)) {
      const groupKey = GroupKey[key as keyof typeof GroupKey]
      const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI

      const color = calculateKeyDataColor(metadata, programmeData, groupKey, level)
      if (color == LightColors.Red) {
        redLights.push(groupKey)
      }
    }

    const hasReport = reports?.[programmeData.koulutusohjelmakoodi]?.['Toimenpiteet']?.length > 0
    return {
      showBadge: redLights.length > 0 && !hasReport,
      showIcon: includeReport && hasReport,
    }
  }

  return {
    renderTrafficLightBadge,
    renderActionsBadge,
    renderTabBadge,
    reports,
  }
}
