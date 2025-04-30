import { Table, TableRow, TableHead, TableBody, TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'

import { useState, useMemo, useEffect } from 'react'
import useFetchKeyData from '@/client/hooks/useFetchKeyData'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Tooltip, Typography, Button } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import { RootState } from '@/client/util/store'

import SearchInput from '../Generic/SearchInputComponent'
import { TrafficLight } from '../Generic/TrafficLightComponent'
// import KeyDataModal, { type selectedKeyFigureData } from './KeyDataModalComponent'
import { getReport } from '@/client/util/redux/reportsSlicer'
import Modal from '../Generic/ModalTemplateComponent'
import { TextFieldCard } from '../Generic/TextFieldComponent'
import { orderBy } from 'lodash'
import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'
import NotificationBadge from '../Generic/NotificationBadge'
import { setViewOnly } from '@/client/util/redux/formReducer'
import { calculateKeyDataColor } from '../Utils/util'

const programmeKeyDataTableComponent = ({
  programme,
  metadata,
}: {
  programme: KeyDataProgramme
  metadata: KeyDataMetadata[]
}) => {
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'en' | 'se'
  const { t } = useTranslation()

  const TrafficLightCell = ({
    metadata,
    programmeData,
    groupKey,
    // handleModalOpen,
  }: {
    metadata: KeyDataMetadata[]
    programmeData: KeyDataProgramme
    groupKey: GroupKey
    // handleModalOpen: (programme: KeyDataProgramme, type: GroupKey) => void
  }) => {
    const { renderTrafficLightBadge } = useNotificationBadge()
    const { t } = useTranslation()
    const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI
    const color = calculateKeyDataColor(metadata, programmeData, groupKey, level)
    const shouldRenderBadge = groupKey !== GroupKey.RESURSSIT && renderTrafficLightBadge(programmeData, groupKey, color)
    return (
      <TableCell
        // onClick={() => handleModalOpen(programmeData, groupKey)}
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

  const keyFigureData: any[] = []

  return (
    <div style={{ minWidth: 1200 }}>
      <Table variant="programme">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <Typography variant="regularSmall">{t('keyData:vetovoimaisuus')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="regularSmall">{t('keyData:lapivirtaus')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="regularSmall">{t('keyData:opiskelijapalaute')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="regularSmall">{t('keyData:resurssit')}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="regularSmall">{t('keyData:actions')}</Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {keyFigureData.length > 0 ? (
            keyFigureData.map((programmeData: KeyDataProgramme) => (
              <TableRow key={programmeData.koulutusohjelmakoodi}>
                <TableCell>2000</TableCell>
                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.VETOVOIMAISUUS}
                  // handleModalOpen={handleModalOpen}
                />

                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.LAPIVIRTAUS}
                  // handleModalOpen={handleModalOpen}
                />

                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.OPISKELIJAPALAUTE}
                  // handleModalOpen={handleModalOpen}
                />

                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.RESURSSIT}
                  // handleModalOpen={handleModalOpen}
                />

                {/* <ActionsCell programmeData={programmeData} metadata={metadata} /> */}
                <TableCell></TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow variant="single-cell">
              <TableCell>
                <Typography variant="light">No Data</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default programmeKeyDataTableComponent
