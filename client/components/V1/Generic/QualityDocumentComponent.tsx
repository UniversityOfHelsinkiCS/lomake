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
    : Array.isArray(doc?.data?.feedbackUtilization?.feedbackSources)
      ? doc.data.feedbackUtilization.feedbackSources
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

  const feedbackUtilizationExamples =
    doc?.data?.feedbackUtilizationExamples ?? doc?.data?.feedbackUtilization?.examples ?? ''

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
    

  const curriculumDevelopment = [
    {
      name: doc?.data?.curriculumDevelopmentNameExample1,
      changes: doc?.data?.curriculumDevelopmentChangesExample1,
      feedbackSource: doc?.data?.curriculumDevelopmentFeedbackSourceExample1,
      communication: doc?.data?.curriculumDevelopmentCommunicationExample1,
    },
    {
      name: doc?.data?.curriculumDevelopmentNameExample2,
      changes: doc?.data?.curriculumDevelopmentChangesExample2,
      feedbackSource: doc?.data?.curriculumDevelopmentFeedbackSourceExample2,
      communication: doc?.data?.curriculumDevelopmentCommunicationExample2,
    },
    {
      name: doc?.data?.curriculumDevelopmentNameExample3,
      changes: doc?.data?.curriculumDevelopmentChangesExample3,
      feedbackSource: doc?.data?.curriculumDevelopmentFeedbackSourceExample3,
      communication: doc?.data?.curriculumDevelopmentCommunicationExample3,
    },
  ].filter(
    example =>
      example.name?.length > 0 ||
      example.changes?.length > 0 ||
      example.feedbackSource?.length > 0 ||
      example.communication?.length > 0
  )

  const guidancePolicies = [
    {
      name: doc?.data?.guidancePoliciesNameExample1,
      changes: doc?.data?.guidancePoliciesChangesExample1,
      feedbackSource: doc?.data?.guidancePoliciesFeedbackSourceExample1,
      communication: doc?.data?.guidancePoliciesCommunicationExample1,
    },
    {
      name: doc?.data?.guidancePoliciesNameExample2,
      changes: doc?.data?.guidancePoliciesChangesExample2,
      feedbackSource: doc?.data?.guidancePoliciesFeedbackSourceExample2,
      communication: doc?.data?.guidancePoliciesCommunicationExample2,
    },
    {
      name: doc?.data?.guidancePoliciesNameExample3,
      changes: doc?.data?.guidancePoliciesChangesExample3,
      feedbackSource: doc?.data?.guidancePoliciesFeedbackSourceExample3,
      communication: doc?.data?.guidancePoliciesCommunicationExample3,
    },
  ].filter(
    example =>
      example.name?.length > 0 ||
      example.changes?.length > 0 ||
      example.feedbackSource?.length > 0 ||
      example.communication?.length > 0
  )

  const learningObjectivesAssessmentExamples = [
    {
      name: doc?.data?.learningObjectivesAssessmentNameExample1,
      changes: doc?.data?.learningObjectivesAssessmentChangesExample1,
      feedbackSource: doc?.data?.learningObjectivesAssessmentFeedbackSourceExample1,
      communication: doc?.data?.learningObjectivesAssessmentCommunicationExample1,
    },
    {
      name: doc?.data?.learningObjectivesAssessmentNameExample2,
      changes: doc?.data?.learningObjectivesAssessmentChangesExample2,
      feedbackSource: doc?.data?.learningObjectivesAssessmentFeedbackSourceExample2,
      communication: doc?.data?.learningObjectivesAssessmentCommunicationExample2,
    },
    {
      name: doc?.data?.learningObjectivesAssessmentNameExample3,
      changes: doc?.data?.learningObjectivesAssessmentChangesExample3,
      feedbackSource: doc?.data?.learningObjectivesAssessmentFeedbackSourceExample3,
      communication: doc?.data?.learningObjectivesAssessmentCommunicationExample3,
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
                              <TableCell align="center" key={`document-${option}`} sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                                <Tooltip
                                  arrow
                                  placement="top"
                                  title={<span style={{ whiteSpace: 'pre-line' }}>{regularityLabel}</span>}
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
                                      cursor: 'help',
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
                                <TableCell align="center" key={`${source.name}-${option}`}>
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
        <Typography variant="h6">{t('qualitydocument:feedbackUtilizationHeader')}:</Typography>
        <Typography color={feedbackUtilizationExamples ? 'default' : 'secondary'}>
          {feedbackUtilizationExamples || t('common:empty')}
        </Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Box sx={sectionHeaderSx}>
        <Typography variant="h5">{t('qualitydocument:curriculumDevelopmentHeader')}</Typography>
        </Box>
        <Typography variant="h6">{t('qualitydocument:examples')}</Typography>
        {(Array.isArray(curriculumDevelopment) ? curriculumDevelopment : []).length > 0 ? (
          (curriculumDevelopment as Array<Record<string, string>>).map((example, exampleIndex) => (
            <Box key={`curriculum-${exampleIndex}`} sx={{ ml: 1 }}>
              <Typography variant="h6">{t(`qualitydocument:example${exampleIndex + 1}`)}</Typography>
              <Typography>{t('qualitydocument:developmentGoal')}</Typography>
              <Typography color={example.name ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.name || t('common:empty')}
              </Typography>
              <Typography>{t('qualitydocument:changes')}</Typography>
              <Typography color={example.changes ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.changes || t('common:empty')}
              </Typography>
              <Typography>{t('qualitydocument:developmentBasis')}</Typography>
              <Typography color={example.feedbackSource ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.feedbackSource || t('common:empty')}
              </Typography>
              <Typography>{t('qualitydocument:communication')}</Typography>
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
        <Typography variant="h5">{t('qualitydocument:guidancePoliciesHeader')}</Typography>
        </Box>
        <Typography variant="h6">{t('qualitydocument:examples')}</Typography>
        {(Array.isArray(guidancePolicies) ? guidancePolicies : []).length > 0 ? (
          (guidancePolicies as Array<Record<string, string>>).map((example, exampleIndex) => (
            <Box key={`guidance-policy-${exampleIndex}`} sx={{ ml: 1 }}>
              <Typography variant="h6">{t(`qualitydocument:example${exampleIndex + 1}`)}</Typography>
              <Typography>{t('qualitydocument:developmentGoal')}</Typography>
              <Typography color={example.name ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.name || t('common:empty')}
              </Typography>
              <Typography>{t('qualitydocument:changes')}</Typography>
              <Typography color={example.changes ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.changes || t('common:empty')}
              </Typography>
              <Typography>{t('qualitydocument:developmentBasis')}</Typography>
              <Typography color={example.feedbackSource ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.feedbackSource || t('common:empty')}
              </Typography>
              <Typography>{t('qualitydocument:communication')}</Typography>
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
          <Typography variant="h4">{t('qualitydocument:learningObjectivesAssessmentHeader')}</Typography>
        </Box>
        <Typography color={'default'}>{t('qualitydocument:learningObjectivesAssessment')}</Typography>
        <Typography color={doc.data.learningObjectivesAssessment ? 'default' : 'secondary'} sx={{ ml: 2 }}>
          {doc.data.learningObjectivesAssessment || t('common:empty')}
        </Typography>
        <Typography color={'default'}>
          {t(`qualitydocument:learningObjectivesAssessmentRegularity`)} 
        </Typography>
        <Typography color={doc.data.learningObjectivesAssessmentRegularity  ? 'default' : 'secondary'} sx={{ ml: 2 }}>
          {t(`qualitydocument:${doc.data.learningObjectivesAssessmentRegularity}`) || t('common:empty')}
        </Typography>
        <Typography variant="h6">{t('qualitydocument:examples')}</Typography>
        {(Array.isArray(learningObjectivesAssessmentExamples) ? learningObjectivesAssessmentExamples : []).length >
        0 ? (
          (learningObjectivesAssessmentExamples as Array<Record<string, string>>).map((example, exampleIndex) => (
            <Box key={`learning-objective-${exampleIndex}`} sx={{ ml: 1 }}>
              <Typography variant="h6">{t(`qualitydocument:example${exampleIndex + 1}`)}</Typography>
              <Typography>{t('qualitydocument:developmentGoal')}</Typography>
              <Typography color={example.name ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.name || t('common:empty')}
              </Typography>
              <Typography>{t('qualitydocument:changes')}</Typography>
              <Typography color={example.changes ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.changes || t('common:empty')}
              </Typography>
              <Typography>{t('qualitydocument:developmentBasis')}</Typography>
              <Typography color={example.feedbackSource ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                {example.feedbackSource || t('common:empty')}
              </Typography>
              <Typography>{t('qualitydocument:communication')}</Typography>
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
