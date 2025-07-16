
import { Box, Card, Avatar, CardHeader, CardContent, Typography } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import { TFunction } from 'i18next'
import ReactMarkdown from 'react-markdown'
import { useGetReportQuery } from '../../../redux/reports'
import { useAppSelector } from '@/client/util/hooks'

type ReportDataKey = 'Vetovoimaisuus' | 'Opintojen sujuvuus ja valmistuminen' | 'Resurssien käyttö' | 'Palaute ja työllistyminen' | 'Toimenpiteet'

export const TextFieldCard = ({ id, t, type, studyprogrammeKey }: { id: ReportDataKey; t: TFunction; type: string, studyprogrammeKey: string }) => {
  const year = useAppSelector(state => state.filters.keyDataYear)
  const { data, isLoading } = useGetReportQuery({ studyprogrammeKey, year }, {
    pollingInterval: 2000,
  })
  const content = (!isLoading && data?.[id]) ? data[id] : ''
  return (
    <Box sx={{ mt: '1rem' }} data-cy="textfield-viewonly">
      <Typography variant="h5" color="textSecondary" sx={{ mb: '1.5rem' }}>
        {t(`keyData:${type}`)}
      </Typography>
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'row',
          minHeight: type !== 'Comment' ? '19rem' : undefined,
        }}
      >
        {type === 'Comment' && (
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'white', color: 'gray' }}>
                <ChatBubbleOutlineIcon sx={{ fontSize: 30 }} />
              </Avatar>
            }
            sx={{
              '& .MuiCardHeader-avatar': {
                marginRight: 0,
              },
            }}
          />
        )}
        <CardContent
          sx={{
            paddingLeft: type === 'Comment' ? 0 : undefined,
            minWidth: 0,
            overflowWrap: 'break-word',
            alignSelf: 'center',
          }}
        >
          {content ? (
            <Typography variant="regular">
              <ReactMarkdown>{content}</ReactMarkdown>
            </Typography>
          ) : (
            <Typography variant="italic">{t(`keyData:no${type}`)}</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
