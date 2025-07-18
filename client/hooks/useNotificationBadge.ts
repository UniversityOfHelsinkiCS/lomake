import { GroupKey, LightColors, ProgrammeLevel } from '@/client/lib/enums'
import type { KeyDataMetadata, KeyDataProgramme, ReportData } from '@/shared/lib/types'
import { calculateKeyDataColor } from '@/client/util/v1'
import { calculateInterventionAreas } from '../components/V1/Generic/InterventionProcedure'
import { useTranslation } from 'react-i18next'
import { DocumentType } from '../lib/types'

export const useNotificationBadge = () => {
  const { t } = useTranslation()

  const renderTabBadge = (programmeData: KeyDataProgramme, metadata: KeyDataMetadata[], reports: Record<string, ReportData | undefined>) => {
    const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.Bachelor : ProgrammeLevel.Master

    if (programmeData.additionalInfo && programmeData.additionalInfo?.fi?.includes('Lakkautettu')) {
      return false
    }

    for (const key of Object.keys(GroupKey)) {
      const groupKey = GroupKey[key as keyof typeof GroupKey]

      const color = calculateKeyDataColor(metadata, programmeData, groupKey, level)

      if (renderTrafficLightBadge(programmeData, groupKey, color, reports)) {
        return true
      }
    }
    return false
  }

  const renderTrafficLightBadge = (programmeData: KeyDataProgramme, groupKey: GroupKey, color: LightColors, reports: Record<string, ReportData | undefined>) => {

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
    reports: Record<string, ReportData | undefined>
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
      const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.Bachelor : ProgrammeLevel.Master

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

  const renderInterventionBadge = (
    programmeData: KeyDataProgramme,
    metadata: KeyDataMetadata[],
    selectedYear: string,
    documents: Record<string, any>
  ) => {
    if (programmeData.additionalInfo?.fi?.includes('Lakkautettu')) {
      return { interventionStatus: false, showBadge: false }
    }

    const redLights = calculateInterventionAreas({ metadata, programme: programmeData, t }).length > 0

    if (!redLights) {
      return { interventionStatus: false, showBadge: false }
    }

    const hasDocumentsForYear = documents.some(
      (doc: DocumentType) =>
        doc.studyprogrammeKey.toString() === programmeData.koulutusohjelmakoodi &&
        doc.activeYear === parseInt(selectedYear),
    )

    const hasActiveDocumentsForYear = documents.some(
      (doc: DocumentType) =>
        doc.studyprogrammeKey.toString() === programmeData.koulutusohjelmakoodi &&
        doc.activeYear === parseInt(selectedYear) &&
        doc.active === true,
    )

    const interventionStatus = !hasDocumentsForYear || hasActiveDocumentsForYear
    const showBadge = interventionStatus && !hasActiveDocumentsForYear

    return {
      interventionStatus,
      showBadge,
    }
  }

  return {
    renderTrafficLightBadge,
    renderActionsBadge,
    renderTabBadge,
    renderInterventionBadge,
  }
}
