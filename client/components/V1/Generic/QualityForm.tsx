import { useState, Fragment } from 'react'
import { Box, Typography, TextField, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { QualityDocumentFormSchema } from '@/shared/validators'
import { TFunction } from 'i18next'
import { useHistory } from 'react-router-dom'
import { Checkbox, Radio } from 'semantic-ui-react'
import { useCreateQualityDocumentMutation } from '@/client/redux/qualityDocuments'

const fields = ['title', 'curriculumProcess', 'guidancePolicies', 'feedbackUtilization', 'feedbackActions', 'actionsRegularity']

const initForm = (t: TFunction, error: boolean) => {
  return fields.reduce(
    (acc, field) => {
      if (field === 'title' && !error)
        acc[field] = `${t('qualitydocument:header')} - ${new Date().toLocaleDateString('fi-FI')}`
      else if (field === 'feedbackActions') acc[field] = ''
      else acc[field] = ''
      return acc
    },
    {} as Record<string, string>,
  )
}

const QualityForm = ({
  programmeKey
}: {
  programmeKey: string
}) => {
  const { t } = useTranslation()
  const history = useHistory()

  const data = initForm(t, false)

  const [createDocument] = useCreateQualityDocumentMutation()
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState(initForm(t, true))
  const [norppa, setNorppa] = useState(false)
  const [careerMonitoring, setCareerMonitoring] = useState(false)
  const [bachelorFeedback, setBachelorFeedback] = useState(false)
  const [other, setOther] = useState(false)
  const [regularity, setRegularity] = useState<'annually' | 'everySemester' | 'moreFrequently'>('annually')


  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prevData: Record<string, any>) => ({
        ...prevData,
        [name]: value,
      }))
    }
  
  
    const validateForm = (payload: Record<string, any> = formData) => {
      const res = QualityDocumentFormSchema.safeParse(payload)
      if (!res.success) {
        const fieldErrors = res.error.format()
        setErrors(
          fields.reduce(
            (acc, field) => {
              // @ts-expect-error
              acc[field] = t(`error:${fieldErrors[field]?._errors?.[0]}`) || ''
              return acc
            },
            {} as Record<string, string>,
          ),
        )
      } else {
        setErrors(initForm(t, true))
      }
      return res.success
    }
  
    const handleSubmit = (e: any) => {
      e.preventDefault()
      const payload = {
        ...formData,
        actionsRegularity: regularity,
        feedbackUtilization: { norppa, careerMonitoring: careerMonitoring, bachelorFeedback, other },
      }
      if (validateForm(payload)) {
        createDocument({ studyprogrammeKey: programmeKey, data: payload })
          setFormData(initForm(t, false))
          setErrors(initForm(t, true))
          history.push(`/v1/programmes/10/${programmeKey}`)
      }
    }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3" sx={{ mb: '4rem' }}>
        {t('qualitydocument:header')} - {`${new Date().toLocaleDateString('fi-FI')}`}
      </Typography>
      <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <Typography variant="h4">{t('qualitydocument:curriculumProcessHeader')}</Typography>
                {fields.map((field, index) => {
                  if (index === 1) {
                    return (
                      <Fragment key={field}>
                        <TextField
                          data-cy={`editor-${field}`}
                          name={field}
                          label={t(`qualitydocument:${field}`)}
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
                  } else if (index === 2) {
                    return (
                      <Fragment key={field}>
                        <Typography variant="h4">{t('qualitydocument:guidancePoliciesHeader')}</Typography>
                        <TextField
                          data-cy={`editor-${field}`}
                          name={field}
                          label={t(`qualitydocument:${field}`)}
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
                        
                        <Typography variant="h4">{t('qualitydocument:feedbackHeader')}</Typography>
                        
                        <Typography variant="h6">{t('qualitydocument:feedbackUtilizationHeader')}</Typography>
                        <Checkbox
                          label={t('qualitydocument:norppa')}
                          onChange={(e: any, data: any) => setNorppa(data.checked)}
                          checked={norppa}
                        />
                        <Checkbox
                          label={t('qualitydocument:careerMonitoring')}
                          onChange={(e: any, data: any) => setCareerMonitoring(data.checked)}
                          checked={careerMonitoring}
                        />
                        <Checkbox
                          label={t('qualitydocument:bachelorFeedback')}
                          onChange={(e: any, data: any) => setBachelorFeedback(data.checked)}
                          checked={bachelorFeedback}
                        />
                        <Checkbox
                          label={t('qualitydocument:other')}
                          onChange={(e: any, data: any) => setOther(data.checked)}
                          checked={other}
                        />                        
                        <Typography variant="h6">{t('qualitydocument:feedbackDescription')}</Typography>
                        <TextField
                          data-cy={`editor-${field}`}
                          name={field}
                          key={field}
                          label={t(`qualitydocument:${field}`)}
                          variant="outlined"
                          margin="normal"
                          value={formData[field]}
                          onChange={handleChange}
                          error={!!errors[field]}
                          helperText={errors[field]}
                          minRows={3}
                          multiline
                        />
                        <Typography variant="h6">{t('qualitydocument:feedbackRegularityHeader')}</Typography>
                        <Radio
                          label={t('qualitydocument:annually')}
                          checked={regularity === 'annually'}
                          onChange={() => setRegularity('annually')}
                        />
                        <Radio
                          label={t('qualitydocument:everySemester')}
                          checked={regularity === 'everySemester'}
                          onChange={() => setRegularity('everySemester')}
                        />
                        <Radio
                          label={t('qualitydocument:moreFrequently')}
                          checked={regularity === 'moreFrequently'}
                          onChange={() => setRegularity('moreFrequently')}
                        />
                      </Fragment>
                    )
                  }
                })}
                <Button
                  data-cy="save-document"
                  key="submit"
                  sx={{ alignSelf: 'flex-end' }}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {t('qualitydocument:submit')}
                </Button>
              </div>
            </form>
     
    </Box>
  )
}

export default QualityForm
