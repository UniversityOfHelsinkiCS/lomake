import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const FeedbackUtilization = ({
  feedbackSource,
  errors,
  setDescription,
  description,
  onRemove,
}: {
  feedbackSource: string
  errors: Record<string, string>
  setDescription: (value: string) => void
  description?: string
  onRemove?: () => void
}) => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ccc',
        padding: '1.5rem',
        borderRadius: '4px',
        gap: '1rem',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h6">
          {!t(`qualitydocument:${feedbackSource}`).startsWith('qualitydocument:')
            ? t(`qualitydocument:${feedbackSource}`)
            : feedbackSource}
        </Typography>
        {onRemove ? (
          <Tooltip arrow placement="left" title={t('qualitydocument:remove')}>
            <IconButton aria-label={t('qualitydocument:remove')} onClick={onRemove} type="button">
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
      <TextField
        data-cy={`${feedbackSource}-description`}
        fullWidth
        helperText={errors[`${feedbackSource}Description`]}
        label={t(`qualitydocument:otherFeedbackSourceDescription`)}
        margin="normal"
        minRows={1}
        multiline
        name={`${feedbackSource}Description`}
        onChange={e => setDescription(e.target.value)}
        value={description}
      />
    </Box>
  )
}

export default FeedbackUtilization
