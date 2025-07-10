import { TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'

import { calculateKeyDataColor } from '@/client/util/v1'

import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'

import { TrafficLight } from '../Generic/TrafficLightComponent'
import NotificationBadge from '../Generic/NotificationBadge'
import { useGetAllDocumentsQuery } from '@/client/redux/documents'
import { useAppSelector } from '@/client/util/hooks'

const TrafficLightCell = ({
  metadata,
  programmeData,
  groupKey,
  handleModalOpen,
}: {
  metadata: KeyDataMetadata[]
  programmeData: KeyDataProgramme
  groupKey: GroupKey
  handleModalOpen: (programme: KeyDataProgramme, type: GroupKey) => void
}) => {
  const activeYear = useAppSelector(state => state.filters.keyDataYear)
  const { data: documents = [] } = useGetAllDocumentsQuery(activeYear)
  const { renderTrafficLightBadge } = useNotificationBadge(documents)
  const { t } = useTranslation()
  const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.Bachelor : ProgrammeLevel.Master
  const color = calculateKeyDataColor(metadata, programmeData, groupKey, level)
  const shouldRenderBadge = groupKey !== GroupKey.RESURSSIT && renderTrafficLightBadge(programmeData, groupKey, color)
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
