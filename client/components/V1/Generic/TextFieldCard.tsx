import { Box, Card, Avatar, CardHeader, CardContent, Typography } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import { TFunction } from 'i18next'
import ReactMarkdown from 'react-markdown'
import { useGetReportQuery } from '../../../redux/reports'

type ReportDataKey =
  | 'Vetovoimaisuus'
  | 'Opintojen sujuvuus ja valmistuminen'
  | 'Resurssien käyttö'
  | 'Palaute ja työllistyminen'
  | 'Toimenpiteet'

export const TextFieldCard = ({
  id,
  t,
  type,
  studyprogrammeKey,
  year,
}: {
  id: ReportDataKey
  t: TFunction
  type: string
  studyprogrammeKey: string
  year: string
}) => {
  const { data, isLoading } = useGetReportQuery(
    { studyprogrammeKey, year },
    {
      pollingInterval: 2000,
    }
  )
  const content = !isLoading && data?.[id] ? data[id] : ''
  return (
    <Box data-cy="textfield-viewonly" sx={{ mt: '1rem' }}>
      <Typography color="textSecondary" sx={{ mb: '1.5rem' }} variant="h5">
        {t(`keyData:${type}`)}
      </Typography>
      <Card
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'row',
          minHeight: type !== 'Comment' ? '19rem' : undefined,
        }}
        variant="outlined"
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
