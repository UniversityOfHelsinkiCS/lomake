import { Box, Typography, TextField, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import { useTranslation } from 'react-i18next'

const FeedbackUtilization = ({
  feedbackSource,
  regularity,
  setRegularity,
  errors,
  setDescription,
  description,
}: {
  feedbackSource: string
  regularity: 'lessFrequently' | 'perCurriculumCycle' | 'annually' | 'everySemester' | 'moreFrequently' | ''
  setRegularity: (
    value: 'lessFrequently' | 'perCurriculumCycle' | 'annually' | 'everySemester' | 'moreFrequently' | ''
  ) => void
  errors: Record<string, string>
  setDescription: (value: string) => void
  description?: string
}) => {
  const { t } = useTranslation()

  const defaultFeedbackSourceOptions = [
    'norppa',
    'howULearn',
    'careerMonitoring',
    'bachelorFeedback',
    'feedbackFromEmployers',
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ccc',
        padding: '2rem',
        borderRadius: '4px',
        gap: '1rem',
      }}
    >
      {!defaultFeedbackSourceOptions.includes(feedbackSource) && (
        <TextField
          data-cy={`${feedbackSource}-description`}
          fullWidth
          label={t(`qualitydocument:otherFeedbackSourceDescription`)}
          margin="normal"
          minRows={1}
          multiline
          name={`${feedbackSource}Description`}
          onChange={e => setDescription(e.target.value)}
          value={description}
        />
      )}
      <Typography variant="h5">{t('qualitydocument:feedbackRegularityHeader')}</Typography>
      <RadioGroup
        aria-label={`${feedbackSource}Regularity`}
        data-cy={`regularity-${feedbackSource}`}
        name={`${feedbackSource}Regularity`}
        onChange={e =>
          setRegularity(
            e.target.value as
              | 'lessFrequently'
              | 'perCurriculumCycle'
              | 'annually'
              | 'everySemester'
              | 'moreFrequently'
              | ''
          )
        }
        value={regularity}
      >
        <FormControlLabel control={<Radio />} label={t('qualitydocument:lessFrequently')} value="lessFrequently" />
        <FormControlLabel
          control={<Radio />}
          label={t('qualitydocument:perCurriculumCycle')}
          value="perCurriculumCycle"
        />
        <FormControlLabel control={<Radio />} label={t('qualitydocument:annually')} value="annually" />
        <FormControlLabel control={<Radio />} label={t('qualitydocument:everySemester')} value="everySemester" />
        <FormControlLabel control={<Radio />} label={t('qualitydocument:moreFrequently')} value="moreFrequently" />
      </RadioGroup>
      {errors[`${feedbackSource}Regularity`] ? (
        <Typography sx={{ color: 'error.main', fontSize: '1.1rem' }} variant="body2">
          {errors[`${feedbackSource}Regularity`]}
        </Typography>
      ) : null}
    </Box>
  )
}

export default FeedbackUtilization
