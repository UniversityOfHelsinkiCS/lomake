import { useState } from 'react'
import { Box, Typography, TextField, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ProgrammeLevel } from '@/client/lib/enums'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/client/util/store'
import { DocumentFormSchema } from '@/shared/validators'
import { createDocument } from '@/client/util/redux/documentsSlicer'

const fields = ['title', 'date', 'participants', 'matters', 'schedule', 'followupDate']

const initForm = () => {
  return fields.reduce((acc, field) => { acc[field] = ''; return acc }, {} as Record<string, string>)
}

const DocumentForm = ({ programmeKey }: { programmeKey: any }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

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
    const res = DocumentFormSchema.safeParse(formData)
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
      dispatch(createDocument({ studyprogrammeKey: programmeKey, data: formData }))
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
