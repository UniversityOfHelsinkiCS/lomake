import { Box, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
const FeedbackUtilization = ({
  feedbackSource,
  errors,
  setDescription,
  description,
}: {
  feedbackSource: string
  errors: Record<string, string>
  setDescription: (value: string) => void
  description?: string
}) => {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '1rem',
        ml: 3,
      }}
    >
      <TextField
        data-cy={`${feedbackSource}-description`}
        fullWidth
        helperText={errors[`${feedbackSource}Description`]}
        label={t(`qualitydocument:addFeedbackSourceDescription`, { feedbackSource })}
        margin="normal"
        minRows={1}
        name={`${feedbackSource}Description`}
        onChange={e => setDescription(e.target.value)}
        value={description}
      />
    </Box>
  )
}

export default FeedbackUtilization
