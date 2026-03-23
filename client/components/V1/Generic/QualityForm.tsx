/* eslint-disable @typescript-eslint/consistent-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, Fragment } from 'react'
import { Box, Typography, TextField, Button, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { QualityDocumentFormSchema } from '@/shared/validators'
import { TFunction } from 'i18next'
import { useNavigate } from 'react-router'
import { Checkbox } from 'semantic-ui-react'
import { useCreateQualityDocumentMutation } from '@/client/redux/qualityDocuments'
import { useAppSelector } from '@/client/util/hooks'
import FeedbackUtilization from './FeedbackUtilizationComponent'
import FeedbackActionForm from './FeedbackActionComponent'

const fields = [
  'title',
  'feedbackUtilization',
  'curriculumDevelopment',
  'guidancePolicies',
  'learningObjectivesAssessment',
]
type FeedbackRegularity = 'lessFrequently' | 'perCurriculumCycle' | 'annually' | 'everySemester' | 'moreFrequently' | ''
const defaultFeedbackSourceOptions = [
  'norppa',
  'howULearn',
  'careerMonitoring',
  'bachelorFeedback',
  'feedbackFromEmployers',
]
type FeedbackSource = string
type FeedbackSourceState = Record<FeedbackSource, { regularity: FeedbackRegularity; modalText: string }>

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
  const [feedbackSources, setFeedbackSources] = useState<FeedbackSourceState>({})
  const [feedbackSourceOptions, setFeedbackSourceOptions] = useState<FeedbackSource[]>(defaultFeedbackSourceOptions)
  const [secondGuidancePoliciesExample, setSecondGuidancePoliciesExample] = useState(false)
  const [thirdGuidancePoliciesExample, setThirdGuidancePoliciesExample] = useState(false)
  const [secondCurriculumDevelopmentExample, setSecondCurriculumDevelopmentExample] = useState(false)
  const [thirdCurriculumDevelopmentExample, setThirdCurriculumDevelopmentExample] = useState(false)
  const [secondLearningObjectivesAssessmentExample, setSecondLearningObjectivesAssessmentExample] = useState(false)
  const [thirdLearningObjectivesAssessmentExample, setThirdLearningObjectivesAssessmentExample] = useState(false)
  const [learningObjectivesAssessmentRegularity, setLearningObjectivesAssessmentRegularity] =
    useState<FeedbackRegularity>('')
  const selectedYear = useAppSelector(state => state.filters.keyDataYear)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData: Record<string, any>) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const addNewFeedbackSource = () => {
    const newSource = (formData.otherFeedbackSource ?? '').trim()
    if (!newSource) return

    setFeedbackSourceOptions(prev => {
      if (prev.some(source => source.toLowerCase() === newSource.toLowerCase())) return prev
      return [...prev, newSource]
    })

    setFormData((prevData: Record<string, any>) => ({
      ...prevData,
      otherFeedbackSource: '',
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
    const payload: Record<string, any> = {
      ...formData,
      feedbackUtilization: feedbackSources,
      learningObjectivesAssessmentRegularity,
    }
    if (validateForm(payload)) {
      createDocument({ studyprogrammeKey: programmeKey, data: payload as any, year: selectedYear })
      setFormData(initForm(t, false))
      setErrors(initForm(t, true))
      setFeedbackSources({})
      navigate(`/v1/programmes/10/${programmeKey}`)
    }
  }

  const handleCheck = (feedbacksource: FeedbackSource, _e: any, data: any) => {
    const checked = Boolean(data.checked)

    setFeedbackSources(prev => {
      if (checked) {
        return {
          ...prev,
          [feedbacksource]: prev[feedbacksource] ?? { regularity: '', modalText: '' },
        }
      }

      const { [feedbacksource]: _removed, ...rest } = prev
      return rest
    })
  }

  const setSourceRegularity = (feedbacksource: FeedbackSource, regularity: FeedbackRegularity) => {
    setFeedbackSources(prev => {
      const current = prev[feedbacksource]
      if (!current) return prev

      return {
        ...prev,
        [feedbacksource]: {
          ...current,
          regularity,
        },
      }
    })
  }

  const setSourceModalText = (feedbacksource: FeedbackSource, modalText: string) => {
    setFeedbackSources(prev => {
      const current = prev[feedbacksource]
      if (!current) return prev

      return {
        ...prev,
        [feedbacksource]: {
          ...current,
          modalText,
        },
      }
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ mb: '4rem' }} variant="h2">
        {t('qualitydocument:header')} - {`${new Date().toLocaleDateString('fi-FI')}`}
      </Typography>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {fields.map((field, index) => {
            if (index === 1) {
              return (
                <Fragment key={field}>
                  <Typography variant="h3">{t('qualitydocument:feedbackHeader')}</Typography>
                  <Typography variant="light">{t('qualitydocument:feedbackUtilizationDescription')}</Typography>
                  <Typography variant="h4">{t('qualitydocument:feedbackSource')}</Typography>
                  <Typography variant="light">{t('qualitydocument:feedbackSourceDescription')}</Typography>
                  {feedbackSourceOptions.map(source => {
                    const sourceState = feedbackSources[source]
                    const isChecked = Boolean(sourceState)

                    return (
                      <Fragment key={source}>
                        <Checkbox
                          checked={isChecked}
                          label={t(`qualitydocument:${source}`)}
                          onChange={(e, data) => handleCheck(source, e, data)}
                          style={{ fontSize: '1.2rem' }}
                        />
                        {isChecked && sourceState ? (
                          <FeedbackUtilization
                            errors={errors}
                            feedbackSource={source}
                            modalText={sourceState.modalText}
                            regularity={sourceState.regularity}
                            setModalText={(value: string) => setSourceModalText(source, value)}
                            setRegularity={(value: FeedbackRegularity) => setSourceRegularity(source, value)}
                          />
                        ) : null}
                      </Fragment>
                    )
                  })}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      data-cy={`editor-otherFeedbackSource`}
                      error={!!errors.otherFeedbackSource}
                      helperText={errors.otherFeedbackSource}
                      label={t(`qualitydocument:otherFeedbackSource`)}
                      name={'otherFeedbackSource'}
                      onChange={handleChange}
                      value={formData.otherFeedbackSource ?? ''}
                      variant="outlined"
                    />
                    <Button onClick={addNewFeedbackSource} type="button" variant="outlined">
                      {t('qualitydocument:addNew')}
                    </Button>
                  </Box>
                </Fragment>
              )
            } else if (index === 2) {
              return (
                <Fragment key={field}>
                  <Typography variant="h3">{t('qualitydocument:curriculumDevelopmentHeader')}</Typography>
                  <Typography variant="light">{t('qualitydocument:curriculumDevelopmentDescription')}</Typography>
                  <FeedbackActionForm
                    errors={errors}
                    example="example1"
                    field={field}
                    formData={formData}
                    handleChange={handleChange}
                    setExample={setSecondCurriculumDevelopmentExample}
                  />
                  {!secondCurriculumDevelopmentExample && (
                    <Button
                      onClick={() => setSecondCurriculumDevelopmentExample(!secondCurriculumDevelopmentExample)}
                      type="button"
                      variant="outlined"
                    >
                      {t('qualitydocument:addNewExample')}
                    </Button>
                  )}
                  {secondCurriculumDevelopmentExample ? (
                    <FeedbackActionForm
                      errors={errors}
                      example="example2"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setSecondCurriculumDevelopmentExample}
                    />
                  ) : null}
                  {!thirdCurriculumDevelopmentExample && secondCurriculumDevelopmentExample ? (
                    <Button
                      onClick={() => setThirdCurriculumDevelopmentExample(!thirdCurriculumDevelopmentExample)}
                      type="button"
                      variant="outlined"
                    >
                      {t('qualitydocument:addNewExample')}
                    </Button>
                  ) : null}
                  {thirdCurriculumDevelopmentExample ? (
                    <FeedbackActionForm
                      errors={errors}
                      example="example3"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setThirdCurriculumDevelopmentExample}
                    />
                  ) : null}
                </Fragment>
              )
            } else if (index === 3) {
              return (
                <Fragment key={field}>
                  <Typography variant="h3">{t('qualitydocument:guidancePoliciesHeader')}</Typography>
                  <Typography variant="light">{t('qualitydocument:guidancePoliciesDescription')}</Typography>
                  <FeedbackActionForm
                    errors={errors}
                    example="example1"
                    field={field}
                    formData={formData}
                    handleChange={handleChange}
                    setExample={setSecondGuidancePoliciesExample}
                  />
                  {!secondGuidancePoliciesExample && (
                    <Button
                      onClick={() => setSecondGuidancePoliciesExample(!secondGuidancePoliciesExample)}
                      type="button"
                      variant="outlined"
                    >
                      {t('qualitydocument:addNewExample')}
                    </Button>
                  )}
                  {secondGuidancePoliciesExample ? (
                    <FeedbackActionForm
                      errors={errors}
                      example="example2"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setSecondGuidancePoliciesExample}
                    />
                  ) : null}
                  {!thirdGuidancePoliciesExample && secondGuidancePoliciesExample ? (
                    <Button
                      onClick={() => setThirdGuidancePoliciesExample(!thirdGuidancePoliciesExample)}
                      type="button"
                      variant="outlined"
                    >
                      {t('qualitydocument:addNewExample')}
                    </Button>
                  ) : null}
                  {thirdGuidancePoliciesExample ? (
                    <FeedbackActionForm
                      errors={errors}
                      example="example3"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setThirdGuidancePoliciesExample}
                    />
                  ) : null}
                </Fragment>
              )
            } else if (index === 4) {
              return (
                <Fragment key={field}>
                  <Typography variant="h3">{t('qualitydocument:learningObjectivesAssessmentHeader')}</Typography>
                  <Typography variant="light">
                    {t('qualitydocument:learningObjectivesAssessmentDescription')}
                  </Typography>

                  <TextField
                    data-cy={`editor-${field}`}
                    error={!!errors[`${field}`]}
                    helperText={errors[`${field}`]}
                    label="Miten osaamistavoitteiden saavuttamista arvioidaan koulutusohjelman johtoryhmässä?"
                    margin="normal"
                    name={`${field}`}
                    onChange={handleChange}
                    value={formData[`${field}`]}
                    variant="outlined"
                  />
                  <Typography variant="light">{t('qualitydocument:learningObjectivesAssessmentRegularity')}</Typography>
                  <RadioGroup
                    aria-label={`learningObjectivesAssessmentRegularity`}
                    data-cy={`regularity-learningObjectivesAssessment`}
                    name={`learningObjectivesAssessmentRegularity`}
                    onChange={e =>
                      setLearningObjectivesAssessmentRegularity(
                        e.target.value as
                          | 'lessFrequently'
                          | 'perCurriculumCycle'
                          | 'annually'
                          | 'everySemester'
                          | 'moreFrequently'
                          | ''
                      )
                    }
                    value={learningObjectivesAssessmentRegularity}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label={t('qualitydocument:lessFrequently')}
                      value="lessFrequently"
                    />
                    <FormControlLabel
                      control={<Radio />}
                      label={t('qualitydocument:perCurriculumCycle')}
                      value="perCurriculumCycle"
                    />
                    <FormControlLabel control={<Radio />} label={t('qualitydocument:annually')} value="annually" />
                    <FormControlLabel
                      control={<Radio />}
                      label={t('qualitydocument:everySemester')}
                      value="everySemester"
                    />
                    <FormControlLabel
                      control={<Radio />}
                      label={t('qualitydocument:moreFrequently')}
                      value="moreFrequently"
                    />
                  </RadioGroup>
                  <Typography variant="light">{t('qualitydocument:learningObjectivesAssessmentExamples')}</Typography>
                  <FeedbackActionForm
                    errors={errors}
                    example="example1"
                    field={field}
                    formData={formData}
                    handleChange={handleChange}
                    setExample={setSecondLearningObjectivesAssessmentExample}
                  />
                  {!secondLearningObjectivesAssessmentExample && (
                    <Button
                      onClick={() =>
                        setSecondLearningObjectivesAssessmentExample(!secondLearningObjectivesAssessmentExample)
                      }
                      type="button"
                      variant="outlined"
                    >
                      {t('qualitydocument:addNewExample')}
                    </Button>
                  )}
                  {secondLearningObjectivesAssessmentExample ? (
                    <FeedbackActionForm
                      errors={errors}
                      example="example2"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setSecondLearningObjectivesAssessmentExample}
                    />
                  ) : null}
                  {!thirdLearningObjectivesAssessmentExample && secondLearningObjectivesAssessmentExample ? (
                    <Button
                      onClick={() =>
                        setThirdLearningObjectivesAssessmentExample(!thirdLearningObjectivesAssessmentExample)
                      }
                      type="button"
                      variant="outlined"
                    >
                      {t('qualitydocument:addNewExample')}
                    </Button>
                  ) : null}
                  {thirdLearningObjectivesAssessmentExample ? (
                    <FeedbackActionForm
                      errors={errors}
                      example="example3"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setThirdLearningObjectivesAssessmentExample}
                    />
                  ) : null}
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
