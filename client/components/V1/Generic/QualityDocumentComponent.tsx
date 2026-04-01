/* eslint-disable prettier/prettier */
/* eslint-disable react/no-array-index-key */
import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'

const QualityDocumentInfo = ({ doc }: { doc: any }) => {
  const { t } = useTranslation()
  const feedbackSources = Array.isArray(doc?.data?.feedbackSources)
    ? doc.data.feedbackSources
    : Array.isArray(doc?.data?.feedbackUtilization?.feedbackSources)
      ? doc.data.feedbackUtilization.feedbackSources
      : []

  const feedbackUtilizationExamples =
    doc?.data?.feedbackutilizationExamples ?? doc?.data?.feedbackUtilization?.examples ?? ''

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
        <Typography variant="h4">{t('qualitydocument:feedbackHeader')}</Typography>
        <Typography variant="h5">{t('qualitydocument:feedbackSources')}:</Typography>
        {feedbackSources.length > 0 ? (
          feedbackSources.map((source: { name: string; regularity: string; description?: string }) => (
            <Box key={`${source.name ?? 'source'}`}>
              <Typography color={'default'}>
                {!t(`qualitydocument:${source.name}`).startsWith('qualitydocument:')
                  ? t(`qualitydocument:${source.name}`)
                  : source.name}
              </Typography>
              {source.description ? (
                <><Typography color={'default'} sx={{ ml: 2 }}>
                  {t(`qualitydocument:description`)}
                </Typography><Typography color={'default'} sx={{ ml: 3 }}>
                    {source.description}
                  </Typography></>
                
              ) : null}
              <Typography color={'default'} sx={{ ml: 2 }}>
                {t(`qualitydocument:regularity`)} {t(`qualitydocument:${source.regularity}`)}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography color="secondary">{t('common:empty')}</Typography>
        )}
        <Typography variant="h5">{t('qualitydocument:feedbackUtilizationHeader')}:</Typography>
        <Typography color={feedbackUtilizationExamples ? 'default' : 'secondary'}>
          {feedbackUtilizationExamples || t('common:empty')}
        </Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Typography variant="h4">{t('qualitydocument:curriculumDevelopmentHeader')}</Typography>
        <Typography variant="h5">{t('qualitydocument:examples')}</Typography>
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
        <Typography variant="h4">{t('qualitydocument:guidancePoliciesHeader')}</Typography>
        <Typography variant="h5">{t('qualitydocument:examples')}</Typography>
        {(Array.isArray(guidancePolicies) ? guidancePolicies : []).length > 0 ? (
          (guidancePolicies as Array<Record<string, string>>).map((example, exampleIndex) => (
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography variant="h4">{t('qualitydocument:learningObjectivesAssessmentHeader')}</Typography>
        <Typography color={'default'}>{t('qualitydocument:learningObjectivesAssessment')}</Typography>
        <Typography color={doc.data.learningObjectivesAssessment ? 'default' : 'secondary'} sx={{ ml: 2 }}>
          {doc.data.learningObjectivesAssessment || t('common:empty')}
        </Typography>
        <Typography color={doc.data.learningObjectivesAssessmentRegularity ? 'default' : 'secondary'}>
          {t(`qualitydocument:regularity`)} {t(`qualitydocument:${doc.data.learningObjectivesAssessmentRegularity}`) || t('common:empty')}
        </Typography>
        <Typography variant="h5">{t('qualitydocument:examples')}</Typography>
        {(Array.isArray(learningObjectivesAssessmentExamples) ? learningObjectivesAssessmentExamples : []).length >
        0 ? (
          (learningObjectivesAssessmentExamples as Array<Record<string, string>>).map((example, exampleIndex) => (
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
    </div>
  )
}

export default QualityDocumentInfo
