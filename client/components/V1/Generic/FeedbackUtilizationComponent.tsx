import { Box, Typography, TextField, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import { useTranslation } from 'react-i18next'

const FeedbackUtilization = ({
  feedbackSource,
  regularity,
  setRegularity,
  modalText,
  setModalText,
  errors,
}: {
  feedbackSource: string
  regularity: 'lessFrequently' | 'perCurriculumCycle' | 'annually' | 'everySemester' | 'moreFrequently' | ''
  setRegularity: (
    value: 'lessFrequently' | 'perCurriculumCycle' | 'annually' | 'everySemester' | 'moreFrequently' | ''
  ) => void
  modalText: string
  setModalText: (value: string) => void
  errors: Record<string, string>
}) => {
  const { t } = useTranslation()

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

      <br />
      {regularity ? (
        <>
          <Typography variant="h5">{t('qualitydocument:feedbackUtilizationHeader')}</Typography>
          <Typography variant="light">{t('qualitydocument:feedbackUtilizationExamples')}</Typography>
          <TextField
            data-cy={`examples-${feedbackSource}`}
            error={!!errors[feedbackSource]}
            fullWidth
            helperText={errors[feedbackSource]}
            label={t(`qualitydocument:examples`)}
            margin="normal"
            minRows={3}
            multiline
            name={`${feedbackSource}Examples`}
            onChange={e => setModalText(e.target.value)}
            value={modalText}
          />
        </>
      ) : null}
    </Box>
  )
}

export default FeedbackUtilization
