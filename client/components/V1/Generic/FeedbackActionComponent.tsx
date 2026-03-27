import { Box, Typography, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Button } from 'semantic-ui-react'

const FeedbackActionForm = ({
  example,
  field,
  handleChange,
  errors,
  formData,
  setExample,
}: {
  example: string
  field: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: Record<string, string>
  formData: Record<string, any>
  setExample: (value: boolean) => void
}) => {
  const { t } = useTranslation()

  const handleCancelClick = () => {
    setExample(false)
    formData[`${field}Name-${example}`] = ''
    formData[`${field}Changes-${example}`] = ''
    formData[`${field}FeedbackSource-${example}`] = ''
    formData[`${field}Communication-${example}`] = ''
  }

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
      <Typography variant="h4">{t(`qualitydocument:${example}`)}</Typography>
      <TextField
        data-cy={`editor-${field}-${example}-name`}
        error={!!errors[`${field}Name-${example}`]}
        helperText={errors[`${field}Name-${example}`]}
        label={t(`qualitydocument:developmentGoalName`)}
        margin="normal"
        name={`${field}Name-${example}`}
        onChange={handleChange}
        value={formData[`${field}Name-${example}`] ?? ''}
        variant="outlined"
      />
      <TextField
        data-cy={`editor-${field}-${example}-changes`}
        error={!!errors[`${field}Changes-${example}`]}
        helperText={errors[`${field}Changes-${example}`]}
        label={t(`qualitydocument:changes`)}
        margin="normal"
        minRows={3}
        multiline
        name={`${field}Changes-${example}`}
        onChange={handleChange}
        value={formData[`${field}Changes-${example}`] ?? ''}
        variant="outlined"
      />
      <TextField
        data-cy={`editor-${field}-${example}-feedbackSource`}
        error={!!errors[`${field}FeedbackSource-${example}`]}
        helperText={errors[`${field}FeedbackSource-${example}`]}
        label={t(`qualitydocument:developmentBasis`)}
        margin="normal"
        minRows={3}
        multiline
        name={`${field}FeedbackSource-${example}`}
        onChange={handleChange}
        value={formData[`${field}FeedbackSource-${example}`] ?? ''}
        variant="outlined"
      />
      <TextField
        data-cy={`editor-${field}-${example}-communication`}
        error={!!errors[`${field}Communication-${example}`]}
        helperText={errors[`${field}Communication-${example}`]}
        label={t(`qualitydocument:communication`)}
        margin="normal"
        minRows={3}
        multiline
        name={`${field}Communication-${example}`}
        onChange={handleChange}
        value={formData[`${field}Communication-${example}`] ?? ''}
        variant="outlined"
      />
      {example != 'example1' && (
        <Button onClick={handleCancelClick} type="button" variant="outlined">
          {t(`qualitydocument:${example}Remove`)}
        </Button>
      )}
    </Box>
  )
}

export default FeedbackActionForm
