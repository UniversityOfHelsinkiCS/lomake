import { Box, Typography, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Button } from 'semantic-ui-react'
import CharacterCounter from './Charactercounter'

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
        helperText={
          <CharacterCounter count={formData[`${field}ChangesExample${example}`]?.length || 0} maxLength={1500} />
        }
        label={t(`qualitydocument:changes`)}
        margin="normal"
        minRows={3}
        multiline
        name={`${field}ChangesExample${example}`}
        onChange={handleChange}
        slotProps={{ htmlInput: { maxLength: 1500 } }}
        value={formData[`${field}ChangesExample${example}`] ?? ''}
        variant="outlined"
      />
      <TextField
        data-cy={`editor-${field}-example${example}-feedbackSource`}
        error={!!errors[`${field}FeedbackSourceExample${example}`]}
        helperText={
          <CharacterCounter count={formData[`${field}FeedbackSourceExample${example}`]?.length || 0} maxLength={1500} />
        }
        label={t(`qualitydocument:developmentBasis`)}
        margin="normal"
        minRows={3}
        multiline
        name={`${field}FeedbackSourceExample${example}`}
        onChange={handleChange}
        slotProps={{ htmlInput: { maxLength: 1500 } }}
        value={formData[`${field}FeedbackSourceExample${example}`] ?? ''}
        variant="outlined"
      />
      <TextField
        data-cy={`editor-${field}-example${example}-communication`}
        error={!!errors[`${field}CommunicationExample${example}`]}
        helperText={
          <CharacterCounter count={formData[`${field}CommunicationExample${example}`]?.length || 0} maxLength={1500} />
        }
        label={t(`qualitydocument:communication`)}
        margin="normal"
        minRows={3}
        multiline
        name={`${field}CommunicationExample${example}`}
        onChange={handleChange}
        slotProps={{ htmlInput: { maxLength: 1500 } }}
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
