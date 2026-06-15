/* eslint-disable prettier/prettier */
/* eslint-disable react/no-array-index-key */
import { useTranslation } from 'react-i18next'
import { 
  Box,
  Typography,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { defaultFeedbackSourceOptions, feedbackRegularityOptions } from './QualityForm'
import { customColors } from '../../../../theme'

export const sectionHeaderSx = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: customColors.grayLight,
  borderLeft: `8px solid`,
  padding: '1.25rem 2rem',
  borderLeftColor: 'lightblue',
}

const fields = ['curriculum', 'guidance', 'learning'] as const
const QualityDocumentInfo = ({ doc }: { doc: any }) => {
  const { t } = useTranslation()
  const hasText = (value?: string) => typeof value === 'string' && value.trim().length > 0

  const feedbackSources = Array.isArray(doc?.data?.feedbackSources)
    ? doc.data.feedbackSources
    : Array.isArray(doc?.data?.feedback?.feedbackSources)
      ? doc.data.feedback.feedbackSources
      : []


  const allFeedbackSources = [
    ...feedbackSources,
    ...defaultFeedbackSourceOptions.filter(
        option => !feedbackSources.some((source: { name: string }) => source.name === option)
    ).map(option => ({
      name: option,
      regularity: 'notUsed',
      description: '',
    })),
  ]

  const addedFeedbackSources = feedbackSources.filter(source => !defaultFeedbackSourceOptions.includes(source.name))

  const feedbackExamples =
    doc?.data?.feedbackExamples ?? doc?.data?.feedback?.examples ?? ''

  const defaultFeedbackSourceOrder = new Map(
    defaultFeedbackSourceOptions.map((option, index) => [option.toLowerCase(), index])
  )

  allFeedbackSources.sort((a, b) => {
    const orderA = defaultFeedbackSourceOrder.get(a.name.toLowerCase())
    const orderB = defaultFeedbackSourceOrder.get(b.name.toLowerCase())

    if (orderA !== undefined && orderB !== undefined) {
      return orderA - orderB
    }

    if (orderA !== undefined) {
      return -1
    }

    if (orderB !== undefined) {
      return 1
    }

    return 0
  })
    

  type Field = (typeof fields)[number]
  type Example = {
    name?: string
    changes?: string
    feedbackSource?: string
    communication?: string
  }

  const examplesByField = fields.reduce((acc, field) => {
    acc[field] = [1, 2, 3]
      .map(exampleNumber => {

        return {
          name: doc?.data?.[`${field}NameExample${exampleNumber}`],
          changes: doc?.data?.[`${field}ChangesExample${exampleNumber}`],
          feedbackSource: doc?.data?.[`${field}FeedbackSourceExample${exampleNumber}`],
          communication: doc?.data?.[`${field}CommunicationExample${exampleNumber}`],
        }
      })
      .filter(
        example =>
          hasText(example.name) ||
          hasText(example.changes) ||
          hasText(example.feedbackSource) ||
          hasText(example.communication)
      )

    return acc
  }, {} as Record<Field, Example[]>)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Box sx={sectionHeaderSx}>
            <Typography variant="h5">{t('qualitydocument:feedbackHeader')}</Typography>
        </Box>
        <Typography variant="h6">{t('qualitydocument:feedbackSources')}:</Typography>
        <TableContainer sx={{ border: `1px solid ${customColors.grayLight}`, borderRadius: 2, maxWidth: '100%' }}>
                    <Table size="small" sx={{ minWidth: 900 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}></TableCell>
                          {feedbackRegularityOptions.map(option => {
                            const regularityLabel = t(`qualitydocument:${option}`)

                            return (
                              <TableCell
                                align="center"
                                key={`document-${option}`}
                                sx={{
                                  fontWeight: 700,
                                  fontSize: '0.8rem',
                                  borderLeft: `1px solid ${customColors.grayLight}`,
                                }}
                              >
                                <Tooltip
                                  arrow
                                  placement="top"
                                  title={<span style={{ whiteSpace: 'pre-line'}}>{regularityLabel}</span>}
                                >
                                  <span
                                    style={{
                                      whiteSpace: 'pre-line',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {regularityLabel}
                                  </span>
                                </Tooltip>
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allFeedbackSources.map(source => {
                                                    return (
                            <TableRow hover key={`${source.name}`}>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
                                  {!t(`qualitydocument:${source.name}`).startsWith('qualitydocument:')
                                    ? t(`qualitydocument:${source.name}`)
                                    : source.name}
                                </Box>
                              </TableCell>
                              {feedbackRegularityOptions.map(option => (
                                <TableCell
                                  align="center"
                                  key={`${source.name}-${option}`}
                                  sx={{ borderLeft: `1px solid ${customColors.grayLight}` }}
                                >
                                  <Typography sx={{fontSize: '1.5rem'}}>
                                    {source.regularity === option ? '✓' : ''}
                                  </Typography>
                                </TableCell>
                              ))}
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {addedFeedbackSources.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Typography variant="h6">{t(`qualitydocument:otherFeedbackSourceDescription`)}</Typography>
                    {addedFeedbackSources.map((source: { name: string; description: string }) => (
                      <Box key={`${source.name}`}>
                        <Typography>
                          {source.name}:
                        </Typography>
                        <Typography color={source.description ? 'default' : 'secondary'} data-cy={`${source.name}-description`} sx={{ ml: 2 }}>
                          {source.description || t('common:empty')}
                        </Typography>
                      </Box>
                    ))}
                    </Box>
                  ) : null}
        <Typography variant="h6">{t('qualitydocument:feedbackUtilizationHeader')}</Typography>
        <Typography>{t('qualitydocument:feedbackExamples')}</Typography>
        <Typography color={feedbackExamples ? 'default' : 'secondary'} data-cy='feedback-examples' sx={{ ml: 2 }}>
          {feedbackExamples || t('common:empty')}
        </Typography>
      </div>
      {fields.map((field, index) => {
        const examples = examplesByField[field]
        const isLearning = field === 'learning'

        return (
          <div
            key={field}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: index === 2 ? '1rem' : '2rem',
            }}
          >
            <Box sx={sectionHeaderSx}>
              <Typography variant={isLearning ? 'h4' : 'h5'}>{t(`qualitydocument:${field}Header`)}</Typography>
            </Box>
            {isLearning ? (
              <>
                <Typography>{t('qualitydocument:learning')}</Typography>
                <Typography color={doc.data.learning ? 'default' : 'secondary'} data-cy='learning' sx={{ ml: 2 }}>
                  {doc.data.learning || t('common:empty')}
                </Typography>
                <Typography>{t('qualitydocument:learningRegularity')}</Typography>
                <Typography color={doc.data.learningRegularity ? 'default' : 'secondary'} data-cy="learning-regularity" sx={{ ml: 2 }}>
                  {t(`qualitydocument:${doc.data.learningRegularity}`) || t('common:empty')}
                </Typography>
                <br />
              </>
            ) : null}
            <Typography>{t(`qualitydocument:${field}Examples`)}</Typography>
            {examples.length > 0 ? (
              examples.map((example, exampleIndex) => (
                <Box key={`${field}-${exampleIndex}`}>
                  <Typography sx={{ ml: 1 }} variant="h6">{t(`qualitydocument:example${exampleIndex + 1}`)}</Typography>
                  <Typography sx={{ ml: 2 }}>{t('qualitydocument:developmentGoal')}</Typography>
                  <Typography color={example.name ? 'default' : 'secondary'} data-cy={`${field}-${exampleIndex + 1}-name`} sx={{ ml: 3 }}>
                    {example.name || t('common:empty')}
                  </Typography>
                  <Typography sx={{ ml: 2 }}>{t('qualitydocument:changes')}</Typography>
                  <Typography color={example.changes ? 'default' : 'secondary'} data-cy={`${field}-${exampleIndex + 1}-changes`} sx={{ ml: 3 }}>
                    {example.changes || t('common:empty')}
                  </Typography>
                  <Typography sx={{ ml: 2 }}>{t('qualitydocument:developmentBasis')}</Typography>
                  <Typography color={example.feedbackSource ? 'default' : 'secondary'} data-cy={`${field}-${exampleIndex + 1}-feedback`} sx={{ ml: 3 }}>
                    {example.feedbackSource || t('common:empty')}
                  </Typography>
                  <Typography sx={{ ml: 2 }}>{t('qualitydocument:communication')}</Typography>
                  <Typography color={example.communication ? 'default' : 'secondary'} data-cy={`${field}-${exampleIndex + 1}-name`}sx={{ ml: 3 }}>
                    {example.communication || t('common:empty')}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="secondary" data-cy={`${field}-empty-examples`} sx={{ ml: 2 }}>{t('common:empty')}</Typography>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default QualityDocumentInfo
