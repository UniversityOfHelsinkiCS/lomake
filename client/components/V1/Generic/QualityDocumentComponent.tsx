/* eslint-disable react/no-array-index-key */
import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'

const QualityDocumentInfo = ({ doc }: { doc: any }) => {
  const { t } = useTranslation()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Typography variant="h4">{t('qualitydocument:feedbackHeader')}</Typography>
        <Typography variant="h5">{t('qualitydocument:feedbackSources')}:</Typography>
        {doc.data.feedbackUtilization.feedbackSources.map(
          (source: { name: string; regularity: string; description?: string }) => (
            <Box key={`${source.name ?? 'source'}`}>
              <Typography color={'default'}>
                {!t(`qualitydocument:${source.name}`).startsWith('qualitydocument:')
                  ? t(`qualitydocument:${source.name}`)
                  : source.name}
              </Typography>
              {source.description ? (
                <Typography color={source.description ? 'default' : 'secondary'} sx={{ ml: 2 }}>
                  {t(`qualitydocument:description`)} {source.description}
                </Typography>
              ) : null}
              <Typography color={'default'} sx={{ ml: 2 }}>
                {t(`qualitydocument:regularity`)} {t(`qualitydocument:${source.regularity}`)}
              </Typography>
            </Box>
          )
        )}
        <Typography variant="h5">{t('qualitydocument:feedbackUtilizationHeader')}:</Typography>
        <Typography color={doc.data.feedbackUtilization.examples ? 'default' : 'secondary'}>
          {doc.data.feedbackUtilization.examples || t('common:empty')}
        </Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Typography variant="h4">{t('qualitydocument:curriculumDevelopmentHeader')}</Typography>
        <Typography variant="h5">{t('qualitydocument:examples')}</Typography>
        {(Array.isArray(doc.data.curriculumDevelopment) ? doc.data.curriculumDevelopment : []).length > 0 ? (
          (doc.data.curriculumDevelopment as Array<Record<string, string>>).map((example, exampleIndex) => (
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
        {(Array.isArray(doc.data.guidancePolicies) ? doc.data.guidancePolicies : []).length > 0 ? (
          (doc.data.guidancePolicies as Array<Record<string, string>>).map((example, exampleIndex) => (
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
        <Typography color={doc.data.learningObjectivesAssessment.description ? 'default' : 'secondary'} sx={{ ml: 2 }}>
          {doc.data.learningObjectivesAssessment.description || t('common:empty')}
        </Typography>
        <Typography color={'default'}>
          {t(`qualitydocument:regularity`)} {t(`qualitydocument:${doc.data.learningObjectivesAssessment.regularity}`)}
        </Typography>
        <Typography variant="h5">{t('qualitydocument:examples')}</Typography>
        {(Array.isArray(doc.data.learningObjectivesAssessment.learningObjectivesAssessmentExamples)
          ? doc.data.learningObjectivesAssessment.learningObjectivesAssessmentExamples
          : []
        ).length > 0 ? (
          (
            doc.data.learningObjectivesAssessment.learningObjectivesAssessmentExamples as Array<Record<string, string>>
          ).map((example, exampleIndex) => (
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
