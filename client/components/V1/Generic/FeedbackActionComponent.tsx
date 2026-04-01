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
    formData[`${field}NameExample${example}`] = ''
    formData[`${field}ChangesExample${example}`] = ''
    formData[`${field}FeedbackSourceExample${example}`] = ''
    formData[`${field}CommunicationExample${example}`] = ''
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
      <Typography variant="h4">{t(`qualitydocument:example${example}`)}</Typography>
      <TextField
        data-cy={`editor-${field}-example${example}-name`}
        error={!!errors[`${field}NameExample${example}`]}
        helperText={errors[`${field}NameExample${example}`]}
        label={t(`qualitydocument:developmentGoalName`)}
        margin="normal"
        name={`${field}NameExample${example}`}
        onChange={handleChange}
        value={formData[`${field}NameExample${example}`] ?? ''}
        variant="outlined"
      />
      <TextField
        data-cy={`editor-${field}-example${example}-changes`}
        error={!!errors[`${field}ChangesExample${example}`]}
        helperText={errors[`${field}ChangesExample${example}`]}
        label={t(`qualitydocument:changes`)}
        margin="normal"
        minRows={3}
        multiline
        name={`${field}ChangesExample${example}`}
        onChange={handleChange}
        value={formData[`${field}ChangesExample${example}`] ?? ''}
        variant="outlined"
      />
      <TextField
        data-cy={`editor-${field}-example${example}-feedbackSource`}
        error={!!errors[`${field}FeedbackSourceExample${example}`]}
        helperText={errors[`${field}FeedbackSourceExample${example}`]}
        label={t(`qualitydocument:developmentBasis`)}
        margin="normal"
        minRows={3}
        multiline
        name={`${field}FeedbackSourceExample${example}`}
        onChange={handleChange}
        value={formData[`${field}FeedbackSourceExample${example}`] ?? ''}
        variant="outlined"
      />
      <TextField
        data-cy={`editor-${field}-example${example}-communication`}
        error={!!errors[`${field}CommunicationExample${example}`]}
        helperText={errors[`${field}CommunicationExample${example}`]}
        label={t(`qualitydocument:communication`)}
        margin="normal"
        minRows={3}
        multiline
        name={`${field}CommunicationExample${example}`}
        onChange={handleChange}
        value={formData[`${field}CommunicationExample${example}`] ?? ''}
        variant="outlined"
      />
      {example != '1' && (
        <Button onClick={handleCancelClick} type="button" variant="outlined">
          {t(`qualitydocument:example${example}Remove`)}
        </Button>
      )}
    </Box>
  )
}

export default FeedbackActionForm
