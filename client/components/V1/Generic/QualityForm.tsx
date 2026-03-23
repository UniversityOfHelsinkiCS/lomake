/* eslint-disable @typescript-eslint/consistent-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, Fragment } from 'react'
import { Box, Typography, TextField, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { QualityDocumentFormSchema } from '@/shared/validators'
import { TFunction } from 'i18next'
import { useNavigate } from 'react-router'
import { Checkbox, Radio } from 'semantic-ui-react'
import { useCreateQualityDocumentMutation } from '@/client/redux/qualityDocuments'
import { useAppSelector } from '@/client/util/hooks'

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
        acc[field] = `${t('qualitydocument:header')} - ${new Date().toLocaleDateString('fi-FI')}`
      else if (field === 'feedbackActions') acc[field] = ''
      else acc[field] = ''
      return acc
    },
    {} as Record<string, string>
  )
}

const QualityForm = ({ programmeKey }: { programmeKey: string }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const data = initForm(t, false)

  const [createDocument] = useCreateQualityDocumentMutation()
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState(initForm(t, true))
  const [norppa, setNorppa] = useState(false)
  const [careerMonitoring, setCareerMonitoring] = useState(false)
  const [bachelorFeedback, setBachelorFeedback] = useState(false)
  const [other, setOther] = useState(false)
  const [regularity, setRegularity] = useState<'annually' | 'everySemester' | 'moreFrequently'>('annually')

  const selectedYear = useAppSelector(state => state.filters.keyDataYear)

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
          {} as Record<string, string>
        )
      )
    }
    return res.success
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const payload = {
      ...formData,
      actionsRegularity: regularity,
      feedbackUtilization: { norppa, careerMonitoring, bachelorFeedback, other },
    }
    if (validateForm(payload)) {
      createDocument({ studyprogrammeKey: programmeKey, data: payload, year: selectedYear })
      setFormData(initForm(t, false))
      setErrors(initForm(t, true))
      navigate(`/v1/programmes/10/${programmeKey}`)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ mb: '4rem' }} variant="h3">
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

export default QualityForm
