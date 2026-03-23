/* eslint-disable @typescript-eslint/consistent-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState, Fragment } from 'react'
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material'
import { Checkbox, Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { QualityDocumentFormSchema } from '@/shared/validators'
import { useUpdateQualityDocumentMutation } from '@/client/redux/qualityDocuments'
import { TFunction } from 'i18next'
import { useNavigate } from 'react-router'

const fields = [
  'title',
  'curriculumProcess',
  'guidancePolicies',
  'feedbackUtilization',
  'feedbackActions',
  'actionsRegularity',
]

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

const EditQualityDocument = ({
  programmeKey,
  id,
  document,
}: {
  programmeKey: string
  id: string
  document: Record<string, any>
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const data = document.data.curriculumProcess !== undefined ? document.data : initForm(t, false)

  const [updateDocument] = useUpdateQualityDocumentMutation()
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState(initForm(t, true))
  const [norppa, setNorppa] = useState(document.data.feedbackUtilization.norppa ?? false)
  const [careerMonitoring, setCareerMonitoring] = useState(document.data.feedbackUtilization.careerMonitoring ?? false)
  const [bachelorFeedback, setBachelorFeedback] = useState(document.data.feedbackUtilization.bachelorFeedback ?? false)
  const [other, setOther] = useState(document.data.feedbackUtilization.other ?? false)
  const [regularity, setRegularity] = useState<'annually' | 'everySemester' | 'moreFrequently'>(
    document.data.actionsRegularity ?? 'annually'
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData: Record<string, string>) => ({
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
    const payload = {
      ...formData,
      title: document.data.title,
      actionsRegularity: regularity,
      feedbackUtilization: { norppa, careerMonitoring, bachelorFeedback, other },
    }
    if (validateForm(payload)) {
      updateDocument({ studyprogrammeKey: programmeKey, id, data: payload })
      setFormData(initForm(t, false))
      setErrors(initForm(t, true))
      navigate(`/v1/programmes/10/${programmeKey}`)
    }
  }

  if (!document) return <CircularProgress />

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ mb: '4rem' }} variant="h3">
        {`${document.data.title}`}
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
                    error={!!errors[field]}
                    helperText={errors[field]}
                    label={t(`qualitydocument:${field}`)}
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
            } else if (index === 2) {
              return (
                <Fragment key={field}>
                  <Typography variant="h4">{t('qualitydocument:guidancePoliciesHeader')}</Typography>
                  <TextField
                    data-cy={`editor-${field}`}
                    error={!!errors[field]}
                    helperText={errors[field]}
                    label={t(`qualitydocument:${field}`)}
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
                  <Typography variant="h4">{t('qualitydocument:feedbackHeader')}</Typography>

                  <Typography variant="h6">{t('qualitydocument:feedbackUtilizationHeader')}</Typography>
                  <Checkbox
                    checked={norppa}
                    label={t('qualitydocument:norppa')}
                    onChange={(e: any, data: any) => setNorppa(data.checked)}
                  />
                  <Checkbox
                    checked={careerMonitoring}
                    label={t('qualitydocument:careerMonitoring')}
                    onChange={(e: any, data: any) => setCareerMonitoring(data.checked)}
                  />
                  <Checkbox
                    checked={bachelorFeedback}
                    label={t('qualitydocument:bachelorFeedback')}
                    onChange={(e: any, data: any) => setBachelorFeedback(data.checked)}
                  />
                  <Checkbox
                    checked={other}
                    label={t('qualitydocument:other')}
                    onChange={(e: any, data: any) => setOther(data.checked)}
                  />
                  <Typography variant="h6">{t('qualitydocument:feedbackDescription')}</Typography>
                  <TextField
                    data-cy={`editor-${field}`}
                    error={!!errors[field]}
                    helperText={errors[field]}
                    key={field}
                    label={t(`qualitydocument:${field}`)}
                    margin="normal"
                    minRows={3}
                    multiline
                    name={field}
                    onChange={handleChange}
                    value={formData[field]}
                    variant="outlined"
                  />
                  <Typography variant="h6">{t('qualitydocument:feedbackRegularityHeader')}</Typography>
                  <Radio
                    checked={regularity === 'annually'}
                    label={t('qualitydocument:annually')}
                    onChange={() => setRegularity('annually')}
                  />
                  <Radio
                    checked={regularity === 'everySemester'}
                    label={t('qualitydocument:everySemester')}
                    onChange={() => setRegularity('everySemester')}
                  />
                  <Radio
                    checked={regularity === 'moreFrequently'}
                    label={t('qualitydocument:moreFrequently')}
                    onChange={() => setRegularity('moreFrequently')}
                  />
                </Fragment>
              )
            }
          })}
          <Button
            color="primary"
            data-cy="save-document"
            key="submit"
            sx={{ alignSelf: 'flex-end' }}
            type="submit"
            variant="contained"
          >
            {t('qualitydocument:submit')}
          </Button>
        </div>
      </form>
    </Box>
  )
}

export default EditQualityDocument
