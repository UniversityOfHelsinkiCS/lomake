import { useState } from 'react'
import { TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'
import { KeyDataProgramme } from '../../../../shared/lib/types'
import { setViewOnly } from '../../../redux/formReducer'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import Modal from '../Generic/ModalTemplateComponent'
import { Box, Card, CardContent, Typography, Button, Link } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../util/hooks'
import { useGetAllQualityDocumentsQuery } from '../../../redux/qualityDocuments'
import QualityDocumentInfo from './QualityDocumentComponent'
import NotificationBadge from '../Generic/NotificationBadge'
import { colors } from '../../../util/common'
import { ArrowForward } from '@mui/icons-material'
import { basePath } from '../../../../config/common'

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
        <Button onClick={() => setOpen(true)}>
          <NotificationBadge variant="medium" />
        </Button>
        <Modal contentSx={{ width: '800px' }} data-cy="no-quality-doc-modal" open={open} setOpen={setOpen}>
          <Typography variant="h4">{t('keyData:missingQualityDocument')}</Typography>
          <Typography sx={{ mt: 2 }}>{t('qualitydocument:info')}</Typography>
          <Link href={`${basePath}v1/programmes/10/${programmeData.koulutusohjelmakoodi}`}>
            <Button startIcon={<ArrowForward />} sx={{ marginTop: 5, float: 'right' }} variant="outlined">
              {t('keyData:moveToQualityDocument')}
            </Button>
          </Link>
        </Modal>
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
      <Modal contentSx={{ width: '1200px' }} open={open} setOpen={setOpen}>
        <Typography variant="h3">
          {programmeData.koulutusohjelma[lang]} {year}
        </Typography>
        <Box data-cy="textfield-viewonly" sx={{ mt: '1rem', width: '90%' }}>
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
                    <Typography variant="h3">
                      {t('qualitydocument:header')} {`${doc.data.title.split('-')[1] || ''}`.trim()}
                    </Typography>
                    <QualityDocumentInfo doc={doc} />
                  </div>
                </div>
              ) : (
                <Typography variant="italic">{t(`keyData:noQuality`)}</Typography>
              )}
            </CardContent>
          </Card>
          <Link href={`${basePath}v1/programmes/10/${programmeData.koulutusohjelmakoodi}`}>
            <Button
              startIcon={<ArrowForward />}
              sx={{ marginTop: 5, marginBottom: 5, float: 'left' }}
              variant="outlined"
            >
              {t('keyData:moveToQualityDocument')}
            </Button>
          </Link>
          <Box sx={{ clear: 'both', height: '1rem' }} />
        </Box>
      </Modal>
    </TableCell>
  )
}

export default QualityCell
