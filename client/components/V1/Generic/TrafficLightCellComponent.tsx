import { TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'
import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme, ReportData } from '@/shared/lib/types'
import { calculateKeyDataColor } from '@/client/util/v1'
import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'
import { TrafficLight } from '../Generic/TrafficLightComponent'
import NotificationBadge from '../Generic/NotificationBadge'
import { colors } from '@/client/util/common'

const TrafficLightCell = ({
  metadata,
  programmeData,
  groupKey,
  handleModalOpen,
  reports,
  activeYear,
}: {
  metadata: KeyDataMetadata[]
  programmeData: KeyDataProgramme
  groupKey: GroupKey
  handleModalOpen: (programme: KeyDataProgramme, type: GroupKey) => void
  reports: Record<string, ReportData | undefined>
  activeYear: number
}) => {
  const { renderTrafficLightBadge } = useNotificationBadge()
  const { t } = useTranslation()
  const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.Bachelor : ProgrammeLevel.Master
  const color = calculateKeyDataColor(metadata, programmeData, groupKey, level)
  const shouldRenderBadge = renderTrafficLightBadge(programmeData, groupKey, color, reports)
  const backRoundColor = programmeData?.additionalInfo?.fi?.includes('Lakkautettu') ? colors.background_gray : ''
  return (
    <TableCell
      data-cy={`trafficlight-table-cell-${programmeData.koulutusohjelmakoodi}-${groupKey}-${activeYear}`}
      onClick={() => handleModalOpen(programmeData, groupKey)}
      style={{ backgroundColor: backRoundColor }}
    >
      <TrafficLight color={color} variant="medium" />
      {shouldRenderBadge ? (
        <NotificationBadge
          data-cy={`lightCellBadge-${programmeData.koulutusohjelmakoodi}-${groupKey}-${activeYear}`}
          tooltip={t('keyData:missingComment')}
        />
      ) : null}
    </TableCell>
  )
}

export default TrafficLightCell
