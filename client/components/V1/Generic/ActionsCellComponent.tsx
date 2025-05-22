import { useState } from 'react'
import { TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'
import { Typography, Button } from '@mui/material'

import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'

import { setViewOnly } from '@/client/util/redux/formReducer'
import { getReport } from '@/client/util/redux/reportsSlicer'

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'

import Modal from '../Generic/ModalTemplateComponent'
import { TextFieldCard } from '../Generic/TextFieldComponent'
import NotificationBadge from '../Generic/NotificationBadge'
import { useAppDispatch, useAppSelector } from '@/client/util/hooks'

const ActionsCell = ({ programmeData, metadata }: { programmeData: KeyDataProgramme; metadata: KeyDataMetadata[] }) => {
  const { renderActionsBadge } = useNotificationBadge()
  const { t } = useTranslation()
  const lang = useAppSelector(state => state.language) as 'fi' | 'en' | 'se'
  const year = useAppSelector(state => state.filters.keyDataYear)
  const [open, setOpen] = useState(false)

  const dispatch = useAppDispatch()

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

export default ActionsCell
