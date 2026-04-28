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
import { customColors } from '@/theme'

export const sectionHeaderSx = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: customColors.grayLight,
  borderLeft: `8px solid`,
  padding: '1.25rem 2rem',
  borderLeftColor: 'lightblue',
}


const QualityDocumentInfo = ({ doc }: { doc: any }) => {
  const { t } = useTranslation()
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
    

  const curriculum = [
    {
      name: doc?.data?.curriculumNameExample1,
      changes: doc?.data?.curriculumChangesExample1,
      feedbackSource: doc?.data?.curriculumFeedbackSourceExample1,
      communication: doc?.data?.curriculumCommunicationExample1,
    },
    {
      name: doc?.data?.curriculumNameExample2,
      changes: doc?.data?.curriculumChangesExample2,
      feedbackSource: doc?.data?.curriculumFeedbackSourceExample2,
      communication: doc?.data?.curriculumCommunicationExample2,
    },
    {
      name: doc?.data?.curriculumNameExample3,
      changes: doc?.data?.curriculumChangesExample3,
      feedbackSource: doc?.data?.curriculumFeedbackSourceExample3,
      communication: doc?.data?.curriculumCommunicationExample3,
    },
  ].filter(
    example =>
      example.name?.length > 0 ||
      example.changes?.length > 0 ||
      example.feedbackSource?.length > 0 ||
      example.communication?.length > 0
  )

  const guidance = [
    {
      name: doc?.data?.guidanceNameExample1,
      changes: doc?.data?.guidanceChangesExample1,
      feedbackSource: doc?.data?.guidanceFeedbackSourceExample1,
      communication: doc?.data?.guidanceCommunicationExample1,
    },
    {
      name: doc?.data?.guidanceNameExample2,
      changes: doc?.data?.guidanceChangesExample2,
      feedbackSource: doc?.data?.guidanceFeedbackSourceExample2,
      communication: doc?.data?.guidanceCommunicationExample2,
    },
    {
      name: doc?.data?.guidanceNameExample3,
      changes: doc?.data?.guidanceChangesExample3,
      feedbackSource: doc?.data?.guidanceFeedbackSourceExample3,
      communication: doc?.data?.guidanceCommunicationExample3,
    },
  ].filter(
    example =>
      example.name?.length > 0 ||
      example.changes?.length > 0 ||
      example.feedbackSource?.length > 0 ||
      example.communication?.length > 0
  )

  const learningExamples = [
    {
      name: doc?.data?.learningNameExample1,
      changes: doc?.data?.learningAChangesExample1,
      feedbackSource: doc?.data?.learningFeedbackSourceExample1,
      communication: doc?.data?.learningCommunicationExample1,
    },
    {
      name: doc?.data?.learningNameExample2,
      changes: doc?.data?.learningChangesExample2,
      feedbackSource: doc?.data?.learningFeedbackSourceExample2,
      communication: doc?.data?.learningCommunicationExample2,
    },
    {
      name: doc?.data?.learningNameExample3,
      changes: doc?.data?.learningChangesExample3,
      feedbackSource: doc?.data?.learningFeedbackSourceExample3,
      communication: doc?.data?.learningCommunicationExample3,
    },
  ].filter(
    example =>
      example.name?.length > 0 ||
      example.changes?.length > 0 ||
      example.feedbackSource?.length > 0 ||
      example.communication?.length > 0
  )

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
                                  title={<span style={{ whiteSpace: 'pre-line', fontSize: '15px' }}>{regularityLabel}</span>}
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
                        <Typography color={source.description ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                          {source.description || t('common:empty')}
                        </Typography>
                      </Box>
                    ))}
                    </Box>
                  ) : null}
        <Typography variant="h6">{t('qualitydocument:feedbackUtilizationHeader')}</Typography>
        <Typography>{t('qualitydocument:feedbackExamples')}</Typography>
        <Typography color={feedbackExamples ? 'default' : 'secondary'} sx={{ ml: 2 }}>
          {feedbackExamples || t('common:empty')}
        </Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Box sx={sectionHeaderSx}>
        <Typography variant="h5">{t('qualitydocument:curriculumHeader')}</Typography>
        </Box>
        <Typography>{t('qualitydocument:curriculumDescription')}</Typography>
        {(Array.isArray(curriculum) ? curriculum : []).length > 0 ? (
          (curriculum as Array<Record<string, string>>).map((example, exampleIndex) => (
            <Box key={`curriculum-${exampleIndex}`} >
              <Typography variant="h6">{t(`qualitydocument:example${exampleIndex + 1}`)}</Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:developmentGoal')}</Typography>
              <Typography color={example.name ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.name || t('common:empty')}
              </Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:changes')}</Typography>
              <Typography color={example.changes ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.changes || t('common:empty')}
              </Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:developmentBasis')}</Typography>
              <Typography color={example.feedbackSource ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.feedbackSource || t('common:empty')}
              </Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:communication')}</Typography>
              <Typography color={example.communication ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.communication || t('common:empty')}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography color="secondary">{t('common:empty')}</Typography>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Box sx={sectionHeaderSx}>
        <Typography variant="h5">{t('qualitydocument:guidanceHeader')}</Typography>
        </Box>
        <Typography>{t('qualitydocument:guidanceDescription')}</Typography>
        {(Array.isArray(guidance) ? guidance : []).length > 0 ? (
          (guidance as Array<Record<string, string>>).map((example, exampleIndex) => (
            <Box key={`guidance-policy-${exampleIndex}`}>
              <Typography variant="h6">{t(`qualitydocument:example${exampleIndex + 1}`)}</Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:developmentGoal')}</Typography>
              <Typography color={example.name ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.name || t('common:empty')}
              </Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:changes')}</Typography>
              <Typography color={example.changes ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.changes || t('common:empty')}
              </Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:developmentBasis')}</Typography>
              <Typography color={example.feedbackSource ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.feedbackSource || t('common:empty')}
              </Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:communication')}</Typography>
              <Typography color={example.communication ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.communication || t('common:empty')}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography color="secondary">{t('common:empty')}</Typography>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Box sx={sectionHeaderSx}>
          <Typography variant="h4">{t('qualitydocument:learningHeader')}</Typography>
        </Box>
        <Typography>{t('qualitydocument:learning')}</Typography>
        <Typography color={doc.data.learning ? 'default' : 'secondary'} sx={{ ml: 2 }}>
          {doc.data.learning || t('common:empty')}
        </Typography>
        <Typography>
          {t(`qualitydocument:learningRegularity`)} 
        </Typography>
        <Typography color={doc.data.learningRegularity  ? 'default' : 'secondary'} sx={{ ml: 2 }}>
          {t(`qualitydocument:${doc.data.learningRegularity}`) || t('common:empty')}
        </Typography>
        <Typography>{t('qualitydocument:learningExamples')}</Typography>
        {(Array.isArray(learningExamples) ? learningExamples : []).length >
        0 ? (
          (learningExamples as Array<Record<string, string>>).map((example, exampleIndex) => (
            <Box key={`learning-objective-${exampleIndex}`} >
              <Typography variant="h6">{t(`qualitydocument:example${exampleIndex + 1}`)}</Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:developmentGoal')}</Typography>
              <Typography color={example.name ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.name || t('common:empty')}
              </Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:changes')}</Typography>
              <Typography color={example.changes ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.changes || t('common:empty')}
              </Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:developmentBasis')}</Typography>
              <Typography color={example.feedbackSource ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.feedbackSource || t('common:empty')}
              </Typography>
              <Typography sx={{ ml: 1 }}>{t('qualitydocument:communication')}</Typography>
              <Typography color={example.communication ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.communication || t('common:empty')}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography color="secondary">{t('common:empty')}</Typography>
        )}
      </div>
    </div>
  )
}

export default QualityDocumentInfo
