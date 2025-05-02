import { useState } from 'react'
import { z } from 'zod'
import { Box, Typography, TextField, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

const schema = z.object({
  title: z.string().min(1, 'Name is required'),
  date: z.string().date('Invalid date'),
  participants: z.string().min(3, 'Invalid set of participants'),
  matters: z.string().min(100, 'Matters should be at least 100 chars long'),
  schedule: z.string().min(3, 'Invalid description of schedule'),
  followupDate: z.string().date('Invalid date'),
})

const fields = ['title', 'date', 'participants', 'matters', 'schedule', 'followupDate']

const initForm = () => {
  return fields.reduce((acc, field) => { acc[field] = ''; return acc }, {} as Record<string, string>)
}

const DocumentForm = () => {
  const { t } = useTranslation()

  const [formData, setFormData] = useState(initForm())
  const [errors, setErrors] = useState(initForm())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const res = schema.safeParse(formData)
    if (!res.success) {
      const fieldErrors = res.error.format()
      setErrors(
        fields.reduce((acc, field) => {
          // @ts-expect-error
          acc[field] = fieldErrors[field]?._errors?.[0] || '';
          return acc;
        }, {} as Record<string, string>)
      )
    }
    return res.success
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Form submitted', formData)
      setFormData(initForm())
      setErrors(initForm())
    }
  }

  return (
    <Box sx={{}}>
      <Typography variant="h3">Toimenpidelomake</Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5">Yleiset tiedot</Typography>
        {fields.map(field => (
          <TextField
            key={field}
            name={field}
            label={t(`${field}`)}
            variant="outlined"
            margin="normal"
            value={formData[field]}
            onChange={handleChange}
            error={!!errors[field]}
            helperText={errors[field]}
          />
        ))}
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </form>
    </Box>)
}

export default DocumentForm
