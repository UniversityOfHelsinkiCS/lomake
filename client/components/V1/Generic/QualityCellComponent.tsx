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
import ReactMarkdown from 'react-markdown'

const QualityCell = ({ programmeData }: { programmeData: KeyDataProgramme }) => {

  const { t } = useTranslation()
  const lang = useAppSelector(state => state.language) as 'fi' | 'en' | 'se'
  const year = `${programmeData.year + 1}`
  const [open, setOpen] = useState(false)
  const activeYear = useAppSelector(state => state.filters.keyDataYear)


  const dispatch = useAppDispatch()

  const { data: qualityDocuments = [] } = useGetAllQualityDocumentsQuery({ activeYear })

  const document = qualityDocuments.find((doc) => doc.studyprogrammeKey === programmeData.koulutusohjelmakoodi)

   const handleOpen = () => {
    dispatch(setViewOnly(true))
    return setOpen(true)
  }

  if (!document) {
    return <TableCell />
  }

  return (
    <TableCell>
      <Button onClick={handleOpen}>
        <ChatBubbleOutlineIcon sx={{ fontSize: '28px' }} color="secondary" />
      </Button>
      <Modal open={open} setOpen={setOpen}>
              <Typography variant="h3">
                {programmeData.koulutusohjelma[lang]} {year}
              </Typography>
              <Box sx={{ mt: '1rem' }} data-cy="textfield-viewonly">
      <Typography variant="h5" color="textSecondary" sx={{ mb: '1.5rem' }}>
        {t(`keyData:Quality`)}
      </Typography>
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'row',
          minHeight: '19rem',
        }}
      >
        <CardContent
          sx={{
            minWidth: 0,
            overflowWrap: 'break-word',
            alignSelf: 'center',
          }}
        >
          {document ? (
            <Typography variant="regular">
              <ReactMarkdown>{document.data.title}</ReactMarkdown>
              <Typography variant="h5">{t('qualitydocument:curriculumProcessHeader')}</Typography>
              <ReactMarkdown>{document.data.curriculumProcess || t('common:empty')}</ReactMarkdown>
              <Typography variant="h5">{t('qualitydocument:guidancePoliciesHeader')}</Typography>
              <ReactMarkdown>{document.data.guidancePolicies || t('common:empty')}</ReactMarkdown>
              <Typography variant="h5">{t('qualitydocument:feedbackHeader')}</Typography>
              <br />
              <Typography variant="h6">{t('qualitydocument:feedbackUtilizationHeader')}:</Typography>
              <Typography color={Object.entries(document.data.feedbackUtilization || {}).filter(([, value]) => value).length > 0 ? 'default' : 'secondary'}>
                {Object.entries(document.data.feedbackUtilization || {}).filter(([, value]) => value).length > 0 ?
                    Object.entries(document.data.feedbackUtilization).filter(([, value]) => value).map(([key]) => (
                      <li key={key} style={{ listStyle: 'none' }}>{t(`qualitydocument:${key.charAt(0) + key.slice(1)}`)}</li>)) : t('common:empty')}
              </Typography>
              <br />
              <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>{t('qualitydocument:feedbackActions')}:</Typography>
              <ReactMarkdown>{document.data.feedbackActions|| t('common:empty')}</ReactMarkdown>
              <br />      
              <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>{t('qualitydocument:feedbackRegularityHeader')}:</Typography>
              <ReactMarkdown>{t(`qualitydocument:${document.data.actionsRegularity}`)   || t('common:empty')}</ReactMarkdown>
            </Typography>
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

