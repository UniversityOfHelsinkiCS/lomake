import { TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme, ReportData } from '@/shared/lib/types'

import { calculateKeyDataColor } from '@/client/util/v1'

import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'

import { TrafficLight } from '../Generic/TrafficLightComponent'
import NotificationBadge from '../Generic/NotificationBadge'

const TrafficLightCell = ({
  metadata,
  programmeData,
  groupKey,
  handleModalOpen,
  reports
}: {
  metadata: KeyDataMetadata[]
  programmeData: KeyDataProgramme
  groupKey: GroupKey
  handleModalOpen: (programme: KeyDataProgramme, type: GroupKey) => void
  reports: Record<string, ReportData | undefined>
}) => {
  const { renderTrafficLightBadge } = useNotificationBadge()
  const { t } = useTranslation()
  const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.Bachelor : ProgrammeLevel.Master
  const color = calculateKeyDataColor(metadata, programmeData, groupKey, level)
  const shouldRenderBadge = groupKey !== GroupKey.RESURSSIT && renderTrafficLightBadge(programmeData, groupKey, color, reports)
  return (
    <TableCell
      onClick={() => handleModalOpen(programmeData, groupKey)}
      data-cy={`trafficlight-table-cell-${programmeData.koulutusohjelmakoodi}-${groupKey}`}
    >
      <TrafficLight color={color} variant="medium" />
      {shouldRenderBadge && (
        <NotificationBadge
          data-cy={`lightCellBadge-${programmeData.koulutusohjelmakoodi}-${groupKey}`}
          tooltip={t('keyData:missingComment')}
        />
      )}
    </TableCell>
  )
}

export default TrafficLightCell
