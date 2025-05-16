import { useEffect, useState, Fragment } from 'react'
import dayjs from 'dayjs'
import { Box, Typography, TextField, Button } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { fiFI, svSE, enUS } from '@mui/x-date-pickers/locales'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/client/util/store'
import { DocumentFormSchema } from '@/shared/validators'
import { updateDocument } from '@/client/util/redux/documentsSlicer'
import { TFunction } from 'i18next'
import { useHistory } from 'react-router'
import { basePath } from '@/config/common'

const fields = ['title', 'date', 'participants', 'matters', 'schedule', 'followupDate']

const initForm = (t: TFunction, error: boolean) => {
  return fields.reduce((acc, field) => {
    if (field === 'title' && !error) acc[field] = `${t('document:header')} - ${new Date().toLocaleDateString('fi-FI')}`
    else acc[field] = ''; return acc
  }, {} as Record<string, string>)
}

const DocumentForm = ({ programmeKey, id, document }: { programmeKey: string, id: string, document: Record<string, any> }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const lang = useSelector((state: RootState) => state.language)
  const history = useHistory()

  const data = document.data.date !== undefined ? document.data : initForm(t, false)

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
    }));
  }

  const validateForm = () => {
    const res = DocumentFormSchema.safeParse(formData)
    if (!res.success) {
      const fieldErrors = res.error.format()
      setErrors(
        fields.reduce((acc, field) => {
          // @ts-expect-error
          acc[field] = t(`error:${fieldErrors[field]?._errors?.[0]}`) || '';
          return acc;
        }, {} as Record<string, string>)
      )
    }
    return res.success
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (validateForm()) {
      dispatch(updateDocument({ studyprogrammeKey: programmeKey, id: id, data: formData }))
      setFormData(initForm(t, false))
      setErrors(initForm(t, true))
      history.push(`${basePath}v1/programmes/10/${programmeKey}`)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3" sx={{ mb: '2rem' }}>{t('document:header')}</Typography>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Typography variant="h5">{t('document:generalHeader')}</Typography>
          <Typography>{t('document:generalDescription')}</Typography>
          {fields.map((field, index) => {
            if (index === 1 || index === 5) {
              return (
                <LocalizationProvider key={field} dateAdapter={AdapterDayjs} localeText={localeComponent.components.MuiLocalizationProvider.defaultProps.localeText}>
                  <DatePicker
                    label={t(`document:${field}`)}
                    value={formData[field] ? dayjs(formData[field]) : null}
                    onChange={(value) => handleDateChange(field, value)}
                    sx={{ width: '50%' }}
                    format='DD/MM/YYYY'
                    slotProps={{
                      textField: {
                        inputProps: {
                          'data-cy': `editor-${field}`,
                        },
                        error: !!errors[field],
                        helperText: errors[field]
                      },
                      calendarHeader: { format: 'MM/YYYY' }
                    }}
                  />
                </LocalizationProvider>
              )
            } else if (index === 3) {
              return (
                <Fragment key={field}>
                  <Typography variant="h5">{t('document:mattersHeader')}</Typography>
                  <Typography>{t('document:mattersDescription')}</Typography>
                  <TextField
                    data-cy={`editor-${field}`}
                    name={field}
                    label={t(`document:${field}`)}
                    variant="outlined"
                    margin="normal"
                    value={formData[field]}
                    onChange={handleChange}
                    error={!!errors[field]}
                    helperText={errors[field]}
                    minRows={3}
                    multiline
                  />
                </Fragment>
              )
            } else if (index === 4) {
              return (
                <Fragment key={field}>
                  <Typography variant="h5">{t('document:scheduleHeader')}</Typography>
                  <Typography>{t('document:scheduleDescription')}</Typography>
                  <TextField
                    data-cy={`editor-${field}`}
                    key={field}
                    name={field}
                    label={t(`document:${field}`)}
                    variant="outlined"
                    margin="normal"
                    value={formData[field]}
                    onChange={handleChange}
                    error={!!errors[field]}
                    helperText={errors[field]}
                    multiline
                  />
                </Fragment>
              )
            }
            return (
              <Fragment data-cy={`editor-${field}`}>
                <TextField
                  data-cy={`editor-${field}`}
                  key={field}
                  name={field}
                  label={t(`document:${field}`)}
                  variant="outlined"
                  margin="normal"
                  value={formData[field]}
                  onChange={handleChange}
                  error={!!errors[field]}
                  helperText={errors[field]}
                  sx={{ width: '50%' }}
                />
              </Fragment>
            )
          })}
          <Button data-cy='save-document' key="submit" sx={{ alignSelf: 'flex-end' }} type="submit" variant="contained" color="primary">{t('document:submit')}</Button>
        </div>
      </form>
    </Box>
  )
}

export default DocumentForm
