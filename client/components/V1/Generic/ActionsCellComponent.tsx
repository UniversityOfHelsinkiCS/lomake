import { useState } from 'react'
import { TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'
import { Typography, Button } from '@mui/material'

import { KeyDataMetadata, KeyDataProgramme, ReportData } from '@/shared/lib/types'

import { setViewOnly } from '@/client/redux/formReducer'

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'

import Modal from '../Generic/ModalTemplateComponent'
import { TextFieldCard } from '../Generic/TextFieldCard'
import NotificationBadge from '../Generic/NotificationBadge'
import { useAppDispatch, useAppSelector } from '@/client/util/hooks'
import { useParams } from 'react-router'

const ActionsCell = ({ programmeData, metadata, reports }: { programmeData: KeyDataProgramme; metadata: KeyDataMetadata[]; reports: Record<string, ReportData | undefined> }) => {
  const { renderActionsBadge } = useNotificationBadge()
  const { t } = useTranslation()
  const lang = useAppSelector(state => state.language) as 'fi' | 'en' | 'se'
  const year = `${programmeData.year + 1}`
  const [open, setOpen] = useState(false)

  const dispatch = useAppDispatch()

  const actionsBadgeData = renderActionsBadge(programmeData, metadata, true, reports)

  const handleOpen = () => {
    dispatch(setViewOnly(true))
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
        <TextFieldCard id={'Toimenpiteet'} t={t} type={'Measure'} studyprogrammeKey={programmeData.koulutusohjelmakoodi} year={year} />
      </Modal>
    </TableCell>
  )
}

export default ActionsCell
