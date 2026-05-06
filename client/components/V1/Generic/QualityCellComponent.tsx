import { useState } from 'react'
import { TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'
import { KeyDataProgramme } from '@/shared/lib/types'
import { setViewOnly } from '@/client/redux/formReducer'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import Modal from '../Generic/ModalTemplateComponent'
import { Box, Card, CardContent, Typography, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/client/util/hooks'
import { useGetAllQualityDocumentsQuery } from '@/client/redux/qualityDocuments'
import QualityDocumentInfo from './QualityDocumentComponent'
import NotificationBadge from '../Generic/NotificationBadge'
import { colors } from '@/client/util/common'

const QualityCell = ({ programmeData }: { programmeData: KeyDataProgramme }) => {
  const { t } = useTranslation()
  const lang = useAppSelector(state => state.language) as 'fi' | 'en' | 'se'
  const year = `${programmeData.year + 1}`
  const [open, setOpen] = useState(false)
  const selectedYear = useAppSelector(state => state.filters.keyDataYear)

  const dispatch = useAppDispatch()

  const { data: qualityDocuments = [] } = useGetAllQualityDocumentsQuery({ selectedYear })

  const doc = qualityDocuments.find(doc => doc.studyprogrammeKey === programmeData.koulutusohjelmakoodi)

  const handleOpen = () => {
    dispatch(setViewOnly(true))
    return setOpen(true)
  }

  if (!doc && !programmeData.additionalInfo.fi?.includes('Lakkautettu')) {
    return (
      <TableCell>
        <NotificationBadge
          data-cy={`qualityCellBadge-${programmeData.koulutusohjelmakoodi}`}
          tooltip={t('keyData:missingQualityDocument')}
          variant="medium"
        />
      </TableCell>
    )
  }
  if (programmeData.additionalInfo.fi?.includes('Lakkautettu')) {
    return <TableCell style={{ backgroundColor: colors.background_gray }}></TableCell>
  }

  return (
    <TableCell>
      <Button onClick={handleOpen}>
        {doc ? <ChatBubbleOutlineIcon color="secondary" sx={{ fontSize: '28px' }} /> : null}
      </Button>
      <Modal open={open} setOpen={setOpen}>
        <Typography variant="h3">
          {programmeData.koulutusohjelma[lang]} {year}
        </Typography>
        <Box data-cy="textfield-viewonly" sx={{ mt: '1rem' }}>
          <Typography color="textSecondary" sx={{ mb: '1.5rem' }} variant="h5">
            {t(`keyData:Quality`)}
          </Typography>
          <Card
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'row',
              minHeight: '19rem',
            }}
            variant="outlined"
          >
            <CardContent
              data-cy={`quality-document-card-${programmeData.koulutusohjelmakoodi}`}
              sx={{
                minWidth: 0,
                overflowWrap: 'break-word',
                alignSelf: 'center',
              }}
            >
              {doc ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Typography variant="h3">{doc.data.title}</Typography>
                    <QualityDocumentInfo doc={doc} />
                  </div>
                </div>
              ) : (
                <Typography variant="italic">{t(`keyData:noQuality`)}</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </TableCell>
  )
}

export default QualityCell
