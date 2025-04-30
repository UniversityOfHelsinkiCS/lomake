import { useState } from 'react'
import { Table, TableRow, TableHead, TableBody, TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Typography, Button } from '@mui/material'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'

import { calculateKeyDataColor } from '../Utils/util'
import { useDispatch, useSelector } from 'react-redux'
import { setViewOnly } from '@/client/util/redux/formReducer'
import { getReport } from '@/client/util/redux/reportsSlicer'

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

import { RootState, AppDispatch } from '@/client/util/store'
import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'

import { TrafficLight } from '../Generic/TrafficLightComponent'
import Modal from '../Generic/ModalTemplateComponent'
import { TextFieldCard } from '../Generic/TextFieldComponent'
import NotificationBadge from '../Generic/NotificationBadge'

const programmeKeyDataTableComponent = ({
  programmeData,
  metadata,
}: {
  programmeData: KeyDataProgramme[]
  metadata: KeyDataMetadata[]
}) => {
  const { t } = useTranslation()

  const TrafficLightCell = ({
    metadata,
    programmeData,
    groupKey,
  }: {
    metadata: KeyDataMetadata[]
    programmeData: KeyDataProgramme
    groupKey: GroupKey
  }) => {
    const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI
    const color = calculateKeyDataColor(metadata, programmeData, groupKey, level)
    return (
      <TableCell data-cy={`trafficlight-table-cell-${programmeData.koulutusohjelmakoodi}-${groupKey}`}>
        <TrafficLight color={color} variant="medium" />
      </TableCell>
    )
  }

  const ActionsCell = ({
    programmeData,
    metadata,
  }: {
    programmeData: KeyDataProgramme
    metadata: KeyDataMetadata[]
  }) => {
    const { renderActionsBadge } = useNotificationBadge()
    const { t } = useTranslation()
    const lang = useSelector((state: RootState) => state.language) as 'fi' | 'en' | 'se'
    const year = useSelector((state: RootState) => state.filters.keyDataYear)
    const [open, setOpen] = useState(false)
    const dispatch: AppDispatch = useDispatch()

    const actionsBadgeData = renderActionsBadge(programmeData, metadata, true)

    const handleOpen = () => {
      dispatch(setViewOnly(true))
      dispatch(getReport({ studyprogrammeKey: programmeData.koulutusohjelmakoodi, year }))
      return setOpen(true)
    }

    return (
      <TableCell>
        {actionsBadgeData.showBadge && (
          <NotificationBadge
            data-cy={`actionsCellBadge-${programmeData.koulutusohjelmakoodi}`}
            variant="medium"
            tooltip={t('keyData:missingMeasure')}
          />
        )}
        {actionsBadgeData.showIcon && (
          <Button onClick={handleOpen}>
            <ChatBubbleOutlineIcon sx={{ fontSize: '28px' }} color="secondary" />
          </Button>
        )}
        <Modal open={open} setOpen={setOpen}>
          <Typography variant="h3">
            {programmeData.koulutusohjelma[lang]} {year}
          </Typography>
          <TextFieldCard id={'Toimenpiteet'} t={t} type={'Measure'}></TextFieldCard>
        </Modal>
      </TableCell>
    )
  }

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
          {programmeData.length > 0 ? (
            programmeData.map((programmeData: KeyDataProgramme, index) => (
              <TableRow key={programmeData.koulutusohjelmakoodi + index}>
                <TableCell>
                  <Link
                    to={`/v1/programmes/10/${programmeData.koulutusohjelmakoodi}/${programmeData.year}`}
                    style={{ width: '100%' }}
                  >
                    <Typography variant="h5">{programmeData.year}</Typography>
                  </Link>
                </TableCell>

                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.VETOVOIMAISUUS}
                />

                <TrafficLightCell metadata={metadata} programmeData={programmeData} groupKey={GroupKey.LAPIVIRTAUS} />

                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.OPISKELIJAPALAUTE}
                />

                <TrafficLightCell metadata={metadata} programmeData={programmeData} groupKey={GroupKey.RESURSSIT} />

                <ActionsCell programmeData={programmeData} metadata={metadata} />
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
