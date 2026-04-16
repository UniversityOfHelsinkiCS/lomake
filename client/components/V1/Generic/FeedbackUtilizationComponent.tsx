import { Box, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
const FeedbackUtilization = ({
  feedbackSource,
  errors,
  setDescription,
  description,
  index,
}: {
  feedbackSource: string
  errors: Record<string, string>
  setDescription: (value: string) => void
  description?: string
  index: number
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h6">{index + 1}</Typography>
      </Box>
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
