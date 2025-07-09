import { useSelector } from 'react-redux'
import { GroupKey, LightColors, ProgrammeLevel } from '@/client/lib/enums'
import type { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import { calculateKeyDataColor } from '@/client/util/v1'
import { calculateInterventionAreas } from '../components/V1/Generic/InterventionProcedure'
import { RootState } from '../redux'
import { useTranslation } from 'react-i18next'

export const useNotificationBadge = () => {
  const reports = useSelector((state: { reports: any }) => state.reports.dataForYear)
  const documents = useSelector((state: RootState) => state.documents.data)
  const { t } = useTranslation()

  const renderTabBadge = (programmeData: KeyDataProgramme, metadata: KeyDataMetadata[]) => {
    const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.Bachelor : ProgrammeLevel.Master

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
  ) => {
    if (programmeData.additionalInfo?.fi?.includes('Lakkautettu')) {
      return { interventionStatus: false, showBadge: false }
    }

    const redLights = calculateInterventionAreas({ metadata, programme: programmeData, t }).length > 0

    if (!redLights) {
      return { interventionStatus: false, showBadge: false }
    }

    const hasDocumentsForYear = documents.some(
      doc =>
        doc.studyprogrammeKey.toString() === programmeData.koulutusohjelmakoodi &&
        doc.activeYear === parseInt(selectedYear),
    )

    const hasActiveDocumentsForYear = documents.some(
      doc =>
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
    reports,
  }
}
