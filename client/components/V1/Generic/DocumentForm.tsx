/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect, useState, Fragment } from 'react'
// eslint-disable-next-line import-x/no-extraneous-dependencies
import dayjs from 'dayjs'
import { Box, Typography, TextField, Button } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { fiFI, svSE, enUS } from '@mui/x-date-pickers/locales'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import { DocumentFormSchema } from '@/shared/validators'
import { useCreateDocumentMutation } from '@/client/redux/documents'
import { TFunction } from 'i18next'
import { useNavigate } from 'react-router'
import { useAppSelector } from '@/client/util/hooks'

const fields = ['title', 'date', 'participants', 'matters', 'schedule', 'followupDate']

const initForm = (t: TFunction, error: boolean) => {
  return fields.reduce(
    (acc, field) => {
      if (field === 'title' && !error)
        acc[field] = `${t('document:header')} - ${new Date().toLocaleDateString('fi-FI')}`
      else acc[field] = ''
      return acc
    },
    {} as Record<string, string>
  )
}

const DocumentForm = ({ programmeKey }: { programmeKey: string }) => {
  const { t } = useTranslation()
  const lang = useAppSelector(state => state.language)
  const navigate = useNavigate()

  const data = initForm(t, false)
  const [createDocument] = useCreateDocumentMutation()
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState(initForm(t, true))
  const [localeComponent, setLocaleComponent] = useState(fiFI)

  useEffect(() => {
    if (lang === 'fi') setLocaleComponent(fiFI)
    else if (lang === 'se') setLocaleComponent(svSE)
    else setLocaleComponent(enUS)
  }, [lang])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData: Record<string, string>) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleDateChange = (field: string, value: any) => {
    const date = dayjs(value)
    const year = date.year()
    const month = String(date.month() + 1).padStart(2, '0') // Ensure month is two digits
    const day = String(date.date()).padStart(2, '0')
    const final = `${year}-${month}-${day}`

    setFormData((prevData: Record<string, string>) => ({
      ...prevData,
      [field]: final,
    }))
  }

  const validateForm = () => {
    const res = DocumentFormSchema.safeParse(formData)
    if (!res.success) {
      const fieldErrors = res.error.format()
      setErrors(
        fields.reduce(
          (acc, field) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            acc[field] = t(`error:${fieldErrors[field]?._errors?.[0]}`) || ''
            return acc
          },
          {} as Record<string, string>
        )
      )
    }
    return res.success
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (validateForm()) {
      createDocument({ studyprogrammeKey: programmeKey, data: formData })
      setFormData(initForm(t, false))
      setErrors(initForm(t, true))
      navigate(`/v1/programmes/10/${programmeKey}`)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ mb: '4rem' }} variant="h3">
        {t('document:header')} - {`${new Date().toLocaleDateString('fi-FI')}`}
      </Typography>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Typography variant="h4">{t('document:generalHeader')}</Typography>
          <Typography variant="light">{t('document:generalDescription')}</Typography>
          {fields.map((field, index) => {
            if (index === 1 || index === 5) {
              return (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  key={field}
                  localeText={localeComponent.components.MuiLocalizationProvider.defaultProps.localeText}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    label={t(`document:${field}`)}
                    onChange={value => handleDateChange(field, value)}
                    slotProps={{
                      textField: {
                        inputProps: {
                          'data-cy': `editor-${field}`,
                        },
                        error: !!errors[field],
                        helperText: errors[field],
                      },
                      calendarHeader: { format: 'MM/YYYY' },
                    }}
                    sx={{ width: '50%' }}
                    value={formData[field] ? dayjs(formData[field]) : null}
                  />
                </LocalizationProvider>
              )
            } else if (index === 3) {
              return (
                <Fragment key={field}>
                  <Typography variant="h4">{t('document:mattersHeader')}</Typography>
                  <Typography variant="light">{t('document:mattersDescription')}</Typography>
                  <TextField
                    data-cy={`editor-${field}`}
                    error={!!errors[field]}
                    helperText={errors[field]}
                    label={t(`document:${field}`)}
                    margin="normal"
                    minRows={3}
                    multiline
                    name={field}
                    onChange={handleChange}
                    value={formData[field]}
                    variant="outlined"
                  />
                </Fragment>
              )
            } else if (index === 4) {
              return (
                <Fragment key={field}>
                  <Typography variant="h4">{t('document:scheduleHeader')}</Typography>
                  <Typography variant="light">{t('document:scheduleDescription')}</Typography>
                  <TextField
                    data-cy={`editor-${field}`}
                    error={!!errors[field]}
                    helperText={errors[field]}
                    key={field}
                    label={t(`document:${field}`)}
                    margin="normal"
                    multiline
                    name={field}
                    onChange={handleChange}
                    value={formData[field]}
                    variant="outlined"
                  />
                </Fragment>
              )
            }
            return (
              <Fragment key={field}>
                <TextField
                  data-cy={`editor-${field}`}
                  error={!!errors[field]}
                  helperText={errors[field]}
                  key={field}
                  label={t(`document:${field}`)}
                  margin="normal"
                  multiline
                  name={field}
                  onChange={handleChange}
                  sx={{ width: '50%' }}
                  value={formData[field]}
                  variant="outlined"
                />
              </Fragment>
            )
          })}
          <Button
            color="primary"
            data-cy="save-document"
            key="submit"
            sx={{ alignSelf: 'flex-end' }}
            type="submit"
            variant="contained"
          >
            {t('document:submit')}
          </Button>
        </div>
      </form>
    </Box>
  )
}

export default DocumentForm
