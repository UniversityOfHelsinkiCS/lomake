import { Box, Typography, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Button } from 'semantic-ui-react'
import CharacterCounter from './Charactercounter'
import { FormDataState } from '@/shared/lib/types'

const FeedbackActionForm = ({
  example,
  field,
  handleChange,
  errors,
  formData,
  setFormData,
  setExample,
}: {
  example: string
  field: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  errors: Record<string, string>
  formData: FormDataState
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>
  setExample: (value: boolean) => void
}) => {
  const { t } = useTranslation()

  const handleCancelClick = () => {
    setExample(false)
    setFormData(
      prevData =>
        ({
          ...prevData,
          [`${field}NameExample${example}`]: '',
          [`${field}ChangesExample${example}`]: '',
          [`${field}FeedbackSourceExample${example}`]: '',
          [`${field}CommunicationExample${example}`]: '',
        }) as FormDataState
    )
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
        data-cy={`${field}-example${example}-name`}
        label={t(`qualitydocument:developmentGoalName`)}
        margin="normal"
        name={`${field}NameExample${example}`}
        onChange={handleChange}
        value={formData[`${field}NameExample${example}`] ?? ''}
        variant="outlined"
      />
      <TextField
        data-cy={`${field}-example${example}-changes`}
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
        data-cy={`${field}-example${example}-feedbackSource`}
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
        data-cy={`${field}-example${example}-communication`}
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
      {example !== '1' && (
        <Button
          data-cy={`remove-example${example}-${field}`}
          onClick={handleCancelClick}
          style={{ alignSelf: 'flex-start', marginTop: '1rem' }}
          type="button"
          variant="outlined"
        >
          {t(`qualitydocument:example${example}Remove`)}
        </Button>
      )}
    </Box>
  )
}

export default FeedbackActionForm
