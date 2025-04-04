import { useSelector } from 'react-redux'
import { GroupKey } from '@/client/lib/enums'
import { KeyDataProgramme } from '@/shared/lib/types'

export const useNotificationBadge = () => {
  const reports = useSelector((state: { reports: any }) => state.reports.dataForYear)

  const renderTabBadge = (programmeData: KeyDataProgramme) => {
    for (const key of Object.keys(GroupKey)) {
      const groupKey = GroupKey[key as keyof typeof GroupKey]
      if (renderTrafficLightBadge(programmeData, groupKey)) {
        return true
      }
    }
    return false
  }

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
    renderTabBadge,
    reports,
  }
}
