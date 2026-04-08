/* eslint-disable @typescript-eslint/consistent-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { useState, Fragment, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  RadioGroup,
  Radio,
  FormControlLabel,
  IconButton,
  Tooltip,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useTranslation } from 'react-i18next'
import { QualityDocumentFormSchema } from '@/shared/validators'
import { TFunction } from 'i18next'
import { useNavigate } from 'react-router'
import { Checkbox } from 'semantic-ui-react'
import { useCreateQualityDocumentMutation } from '@/client/redux/qualityDocuments'
import { useAppSelector } from '@/client/util/hooks'
import FeedbackUtilization from './FeedbackUtilizationComponent'
import FeedbackActionForm from './FeedbackActionComponent'
import { FeedbackSource, FormDataState, FeedbackSourceState, FeedbackRegularity } from '@/shared/lib/types'
import CharacterCounter from './Charactercounter'
import { customColors } from '@/theme'

const fields = [
  'title',
  'feedbackUtilization',
  'curriculumDevelopment',
  'guidancePolicies',
  'learningObjectivesAssessment',
]

const defaultFeedbackSourceOptions = [
  'norppa',
  'howULearn',
  'careerMonitoring',
  'bachelorFeedback',
  'feedbackFromEmployers',
]

const sectionCardSx = {
  border: `1px solid ${customColors.grayLight}`,
  borderRadius: 2,
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}

const sectionHeaderSx = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: customColors.grayLight,
  borderLeft: `8px solid ${customColors.lightGreenLight}`,
  padding: '1.25rem 2rem',
}

const sectionContentSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  padding: '2rem',
}

const initFormData = (t: TFunction): FormDataState => {
  return {
    title: `${t('qualitydocument:header')} - ${new Date().toLocaleDateString('fi-FI')}`,
    feedbackUtilization: '',
    curriculumDevelopment: '',
    guidancePolicies: '',
    learningObjectivesAssessment: '',
    otherFeedbackSource: '',
    feedbackUtilizationExamples: '',
    feedbackSources: [] as FeedbackSourceState,
    learningObjectivesAssessmentRegularity: '' as FeedbackRegularity,
  }
}

const initErrors = (): Record<string, string> => {
  return fields.reduce(
    (acc, field) => {
      acc[field] = ''
      return acc
    },
    {} as Record<string, string>
  )
}

interface UIState {
  secondGuidancePoliciesExample: boolean
  thirdGuidancePoliciesExample: boolean
  secondCurriculumDevelopmentExample: boolean
  thirdCurriculumDevelopmentExample: boolean
  secondLearningObjectivesAssessmentExample: boolean
  thirdLearningObjectivesAssessmentExample: boolean
}

interface CachedFormState {
  formData: FormDataState
  feedbackSourceOptions: FeedbackSource[]
  uiState: UIState
}

const QualityForm = ({ programmeKey }: { programmeKey: string }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const STORAGE_KEY = `qualityFormCreate_${programmeKey}`

  const [createDocument] = useCreateQualityDocumentMutation()

  const loadCachedData = (): CachedFormState => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        return {
          formData: parsed.formData ?? initFormData(t),
          feedbackSourceOptions: parsed.feedbackSourceOptions ?? defaultFeedbackSourceOptions,
          uiState: parsed.uiState ?? {
            secondGuidancePoliciesExample: false,
            thirdGuidancePoliciesExample: false,
            secondCurriculumDevelopmentExample: false,
            thirdCurriculumDevelopmentExample: false,
            secondLearningObjectivesAssessmentExample: false,
            thirdLearningObjectivesAssessmentExample: false,
          },
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load form data from localStorage:', error)
    }
    return {
      formData: initFormData(t),
      feedbackSourceOptions: defaultFeedbackSourceOptions,
      uiState: {
        secondGuidancePoliciesExample: false,
        thirdGuidancePoliciesExample: false,
        secondCurriculumDevelopmentExample: false,
        thirdCurriculumDevelopmentExample: false,
        secondLearningObjectivesAssessmentExample: false,
        thirdLearningObjectivesAssessmentExample: false,
      },
    }
  }

  const cached = loadCachedData()

  const [formData, setFormData] = useState<FormDataState>(cached.formData)
  const [errors, setErrors] = useState<Record<string, string>>(initErrors())
  const [feedbackSourceOptions, setFeedbackSourceOptions] = useState<FeedbackSource[]>(cached.feedbackSourceOptions)
  const [secondGuidancePoliciesExample, setSecondGuidancePoliciesExample] = useState(
    cached.uiState.secondGuidancePoliciesExample
  )
  const [thirdGuidancePoliciesExample, setThirdGuidancePoliciesExample] = useState(
    cached.uiState.thirdGuidancePoliciesExample
  )
  const [secondCurriculumDevelopmentExample, setSecondCurriculumDevelopmentExample] = useState(
    cached.uiState.secondCurriculumDevelopmentExample
  )
  const [thirdCurriculumDevelopmentExample, setThirdCurriculumDevelopmentExample] = useState(
    cached.uiState.thirdCurriculumDevelopmentExample
  )
  const [secondLearningObjectivesAssessmentExample, setSecondLearningObjectivesAssessmentExample] = useState(
    cached.uiState.secondLearningObjectivesAssessmentExample
  )
  const [thirdLearningObjectivesAssessmentExample, setThirdLearningObjectivesAssessmentExample] = useState(
    cached.uiState.thirdLearningObjectivesAssessmentExample
  )
  const selectedYear = useAppSelector(state => state.filters.keyDataYear)

  useEffect(() => {
    try {
      const dataToSave: CachedFormState = {
        formData,
        feedbackSourceOptions,
        uiState: {
          secondGuidancePoliciesExample,
          thirdGuidancePoliciesExample,
          secondCurriculumDevelopmentExample,
          thirdCurriculumDevelopmentExample,
          secondLearningObjectivesAssessmentExample,
          thirdLearningObjectivesAssessmentExample,
        },
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save form data to localStorage:', error)
    }
  }, [
    formData,
    feedbackSourceOptions,
    secondGuidancePoliciesExample,
    thirdGuidancePoliciesExample,
    secondCurriculumDevelopmentExample,
    thirdCurriculumDevelopmentExample,
    secondLearningObjectivesAssessmentExample,
    thirdLearningObjectivesAssessmentExample,
    STORAGE_KEY,
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(
      prevData =>
        ({
          ...prevData,
          [name]: value,
        }) as FormDataState
    )
  }

  const addNewFeedbackSource = () => {
    const newSource = (formData.otherFeedbackSource ?? '').trim()
    if (!newSource) return

    setFeedbackSourceOptions(prev => {
      if (prev.some(source => source.toLowerCase() === newSource.toLowerCase())) return prev
      return [...prev, newSource]
    })

    setFormData(
      prevData =>
        ({
          ...prevData,
          otherFeedbackSource: '',
        }) as FormDataState
    )
  }

  const removeFeedbackSource = (source: FeedbackSource) => {
    setFeedbackSourceOptions(prev => prev.filter(s => s.toLowerCase() !== source.toLowerCase()))

    setFormData(
      prevData =>
        ({
          ...prevData,
          feedbackSources: prevData.feedbackSources.filter(f => f.name.toLowerCase() !== source.toLowerCase()),
          otherFeedbackSource: '',
        }) as FormDataState
    )
  }

  const validateForm = (payload: Record<string, any> = formData) => {
    const res = QualityDocumentFormSchema.safeParse(payload)
    if (!res.success) {
      const nextErrors = fields.reduce(
        (acc, field) => {
          acc[field] = ''
          return acc
        },
        {} as Record<string, string>
      )

      const setErrorOnce = (key: string, messageKey: string) => {
        if (!key || nextErrors[key]) return
        nextErrors[key] = t(`error:${messageKey}`)
      }

      res.error.issues.forEach(issue => {
        const [root, second] = issue.path

        if (root === 'feedbackSources') {
          if (issue.path.length === 1) {
            setErrorOnce('feedbackUtilization', 'feedbackSourcesRequired')
            setErrorOnce('feedbackUtilizationFeedbackSources', 'feedbackSourcesRequired')
            return
          }

          if (typeof second === 'number') {
            const sourceName = payload.feedbackSources?.[second]?.name
            if (!sourceName || typeof sourceName !== 'string') return

            if (issue.path[2] === 'regularity') {
              setErrorOnce(`${sourceName}Regularity`, 'regularityRequired')
            }
            if (issue.path[2] === 'description') {
              setErrorOnce(`${sourceName}Description`, issue.message)
            }
          }
          return
        }

        if (root === 'learningObjectivesAssessmentRegularity') {
          setErrorOnce('learningObjectivesAssessmentRegularity', 'regularityRequired')
          return
        }

        if (typeof root === 'string' && issue.path.length === 1) {
          setErrorOnce(root, issue.message)
        }
      })

      setErrors(nextErrors)
    }
    return res.success
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const {
      curriculumDevelopment: _curriculumDevelopment,
      guidancePolicies: _guidancePolicies,
      feedbackUtilization: _feedbackUtilization,
      otherFeedbackSource: _otherFeedbackSource,
      ...restFormData
    } = formData

    const payload: Record<string, any> = {
      ...restFormData,
      feedbackSources: formData.feedbackSources.map(({ name, regularity, description }) => ({
        name,
        regularity,
        description,
      })),
    }
    if (validateForm(payload)) {
      createDocument({ studyprogrammeKey: programmeKey, data: payload as any, year: selectedYear })
      setFormData(initFormData(t))
      setErrors(initErrors())
      setFeedbackSourceOptions(defaultFeedbackSourceOptions)
      setSecondGuidancePoliciesExample(false)
      setThirdGuidancePoliciesExample(false)
      setSecondCurriculumDevelopmentExample(false)
      setThirdCurriculumDevelopmentExample(false)
      setSecondLearningObjectivesAssessmentExample(false)
      setThirdLearningObjectivesAssessmentExample(false)
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to clear form data from localStorage:', error)
      }
      navigate(`/v1/programmes/10/${programmeKey}`)
    }
  }

  const handleCheck = (feedbacksource: FeedbackSource, _e: any, data: any) => {
    const checked = Boolean(data.checked)

    setFormData(prevData => {
      const { feedbackSources } = prevData
      if (checked) {
        if (feedbackSources.some(f => f.name === feedbacksource)) return prevData
        return {
          ...prevData,
          feedbackSources: [...feedbackSources, { name: feedbacksource, regularity: '', description: '' }],
        } as FormDataState
      }

      return {
        ...prevData,
        feedbackSources: feedbackSources.filter(f => f.name !== feedbacksource),
      } as FormDataState
    })
  }

  const setSourceRegularity = (feedbacksource: FeedbackSource, regularity: FeedbackRegularity) => {
    setFormData(prevData => {
      const { feedbackSources } = prevData
      const index = feedbackSources.findIndex(f => f.name === feedbacksource)
      if (index === -1) return prevData

      const updated = [...feedbackSources]
      updated[index] = { ...updated[index], regularity }
      return {
        ...prevData,
        feedbackSources: updated,
      } as FormDataState
    })
  }

  const setSourceDescription = (feedbacksource: FeedbackSource, description: string) => {
    setFormData(prevData => {
      const { feedbackSources } = prevData
      const index = feedbackSources.findIndex(f => f.name === feedbacksource)
      if (index === -1) return prevData

      const updated = [...feedbackSources]
      updated[index] = { ...updated[index], description }
      return {
        ...prevData,
        feedbackSources: updated,
      } as FormDataState
    })
  }

  const handleAddCurriculumExampleClick = () => {
    if (!secondCurriculumDevelopmentExample) {
      setSecondCurriculumDevelopmentExample(true)
    } else if (!thirdCurriculumDevelopmentExample) {
      setThirdCurriculumDevelopmentExample(true)
    }
  }

  const handleAddGuidanceExampleClick = () => {
    if (!secondGuidancePoliciesExample) {
      setSecondGuidancePoliciesExample(true)
    } else if (!thirdGuidancePoliciesExample) {
      setThirdGuidancePoliciesExample(true)
    }
  }

  const handleAddLearningObjectivesAssessmentExampleClick = () => {
    if (!secondLearningObjectivesAssessmentExample) {
      setSecondLearningObjectivesAssessmentExample(true)
    } else if (!thirdLearningObjectivesAssessmentExample) {
      setThirdLearningObjectivesAssessmentExample(true)
    }
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
                <Paper key={field} sx={sectionCardSx}>
                  <Box sx={sectionHeaderSx}>
                    <Typography variant="h3">{t('qualitydocument:feedbackHeader')}</Typography>
                  </Box>
                  <Box sx={sectionContentSx}>
                    <Typography variant="light">{t('qualitydocument:feedbackSource')}</Typography>
                    {feedbackSourceOptions.map(source => {
                      const sourceState = formData.feedbackSources.find(f => f.name === source)
                      const isChecked = Boolean(sourceState)

                      return (
                        <Fragment key={source}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Checkbox
                              checked={isChecked}
                              label={
                                !t(`qualitydocument:${source}`).startsWith('qualitydocument:')
                                  ? t(`qualitydocument:${source}`)
                                  : source
                              }
                              onChange={(e, data) => handleCheck(source, e, data)}
                              style={{ fontSize: '1.2rem' }}
                            />
                            {!defaultFeedbackSourceOptions.includes(source) && (
                              <Tooltip arrow placement="right" title={t('qualitydocument:remove')}>
                                <IconButton
                                  aria-label={t('qualitydocument:remove')}
                                  onClick={() => removeFeedbackSource(source)}
                                  type="button"
                                >
                                  <DeleteOutlineIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                          {isChecked && sourceState ? (
                            <FeedbackUtilization
                              description={sourceState.description}
                              errors={errors}
                              feedbackSource={source}
                              regularity={sourceState.regularity}
                              setDescription={(value: string) => setSourceDescription(source, value)}
                              setRegularity={(value: FeedbackRegularity) => setSourceRegularity(source, value)}
                            />
                          ) : null}
                        </Fragment>
                      )
                    })}
                    {errors.feedbackUtilizationFeedbackSources ? (
                      <Typography sx={{ color: 'error.main', fontSize: '1.1rem' }} variant="body2">
                        {errors.feedbackUtilizationFeedbackSources}
                      </Typography>
                    ) : null}

                    <Box sx={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                      <TextField
                        data-cy={`editor-otherFeedbackSource`}
                        label={t(`qualitydocument:otherFeedbackSource`)}
                        name={'otherFeedbackSource'}
                        onChange={handleChange}
                        slotProps={{ htmlInput: { maxLength: 50 } }}
                        value={formData.otherFeedbackSource ?? ''}
                        variant="outlined"
                      />
                      <Button onClick={addNewFeedbackSource} type="button" variant="outlined">
                        {t('qualitydocument:addNew')}
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <Typography variant="h5">{t('qualitydocument:feedbackUtilizationHeader')}</Typography>
                      <Typography variant="light">{t('qualitydocument:feedbackUtilizationExamples')}</Typography>
                      <TextField
                        data-cy={`feedbackUtilization-examples`}
                        error={!!errors.feedbackUtilizationExamples}
                        fullWidth
                        helperText={
                          <CharacterCounter count={formData.feedbackUtilizationExamples.length} maxLength={1500} />
                        }
                        label={t(`qualitydocument:examplesDescription`)}
                        margin="normal"
                        minRows={3}
                        multiline
                        name={`feedbackUtilizationExamples`}
                        onChange={handleChange}
                        slotProps={{ htmlInput: { maxLength: 1500 } }}
                        value={formData.feedbackUtilizationExamples}
                      />
                    </Box>
                  </Box>
                </Paper>
              )
            } else if (index === 2) {
              return (
                <Paper key={field} sx={sectionCardSx}>
                  <Box sx={sectionHeaderSx}>
                    <Typography variant="h3">{t('qualitydocument:curriculumDevelopmentHeader')}</Typography>
                  </Box>
                  <Box sx={sectionContentSx}>
                    <Typography variant="light">{t('qualitydocument:curriculumDevelopmentDescription')}</Typography>
                    <FeedbackActionForm
                      errors={errors}
                      example="1"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setSecondCurriculumDevelopmentExample}
                    />
                    {secondCurriculumDevelopmentExample ? (
                      <FeedbackActionForm
                        errors={errors}
                        example="2"
                        field={field}
                        formData={formData}
                        handleChange={handleChange}
                        setExample={setSecondCurriculumDevelopmentExample}
                      />
                    ) : null}

                    {thirdCurriculumDevelopmentExample ? (
                      <FeedbackActionForm
                        errors={errors}
                        example="3"
                        field={field}
                        formData={formData}
                        handleChange={handleChange}
                        setExample={setThirdCurriculumDevelopmentExample}
                      />
                    ) : null}
                    {!thirdCurriculumDevelopmentExample || !secondCurriculumDevelopmentExample ? (
                      <Button onClick={handleAddCurriculumExampleClick} type="button" variant="outlined">
                        {t('qualitydocument:addNewExample')}
                      </Button>
                    ) : null}
                  </Box>
                </Paper>
              )
            } else if (index === 3) {
              return (
                <Paper key={field} sx={sectionCardSx}>
                  <Box sx={sectionHeaderSx}>
                    <Typography variant="h3">{t('qualitydocument:guidancePoliciesHeader')}</Typography>
                  </Box>
                  <Box sx={sectionContentSx}>
                    <Typography variant="light">{t('qualitydocument:guidancePoliciesDescription')}</Typography>
                    <FeedbackActionForm
                      errors={errors}
                      example="1"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setSecondGuidancePoliciesExample}
                    />
                    {secondGuidancePoliciesExample ? (
                      <FeedbackActionForm
                        errors={errors}
                        example="2"
                        field={field}
                        formData={formData}
                        handleChange={handleChange}
                        setExample={setSecondGuidancePoliciesExample}
                      />
                    ) : null}

                    {thirdGuidancePoliciesExample ? (
                      <FeedbackActionForm
                        errors={errors}
                        example="3"
                        field={field}
                        formData={formData}
                        handleChange={handleChange}
                        setExample={setThirdGuidancePoliciesExample}
                      />
                    ) : null}
                    {!thirdGuidancePoliciesExample || !secondGuidancePoliciesExample ? (
                      <Button onClick={handleAddGuidanceExampleClick} type="button" variant="outlined">
                        {t('qualitydocument:addNewExample')}
                      </Button>
                    ) : null}
                  </Box>
                </Paper>
              )
            } else if (index === 4) {
              return (
                <Paper key={field} sx={sectionCardSx}>
                  <Box sx={sectionHeaderSx}>
                    <Typography variant="h3">{t('qualitydocument:learningObjectivesAssessmentHeader')}</Typography>
                  </Box>
                  <Box sx={sectionContentSx}>
                    <TextField
                      data-cy={`editor-${field}`}
                      error={!!errors[`${field}`]}
                      helperText={errors[`${field}`]}
                      label={t(`qualitydocument:learningObjectivesAssessment`)}
                      margin="normal"
                      minRows={2}
                      multiline
                      name={`${field}`}
                      onChange={handleChange}
                      value={formData[`${field}`]}
                      variant="outlined"
                    />
                    <Typography variant="light">
                      {t('qualitydocument:learningObjectivesAssessmentRegularity')}
                    </Typography>
                    <RadioGroup
                      aria-label="learningObjectivesAssessmentRegularity"
                      data-cy="regularity-learningObjectivesAssessment"
                      name="learningObjectivesAssessmentRegularity"
                      onChange={e =>
                        setFormData(
                          prevData =>
                            ({
                              ...prevData,
                              learningObjectivesAssessmentRegularity: e.target.value as FeedbackRegularity,
                            }) as FormDataState
                        )
                      }
                      value={formData.learningObjectivesAssessmentRegularity}
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
                    {errors.learningObjectivesAssessmentRegularity ? (
                      <Typography sx={{ color: 'error.main', fontSize: '1.1rem' }} variant="body2">
                        {errors.learningObjectivesAssessmentRegularity}
                      </Typography>
                    ) : null}
                    <Typography variant="light">{t('qualitydocument:learningObjectivesAssessmentExamples')}</Typography>
                    <FeedbackActionForm
                      errors={errors}
                      example="1"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setSecondLearningObjectivesAssessmentExample}
                    />
                    {secondLearningObjectivesAssessmentExample ? (
                      <FeedbackActionForm
                        errors={errors}
                        example="2"
                        field={field}
                        formData={formData}
                        handleChange={handleChange}
                        setExample={setSecondLearningObjectivesAssessmentExample}
                      />
                    ) : null}
                    {thirdLearningObjectivesAssessmentExample ? (
                      <FeedbackActionForm
                        errors={errors}
                        example="3"
                        field={field}
                        formData={formData}
                        handleChange={handleChange}
                        setExample={setThirdLearningObjectivesAssessmentExample}
                      />
                    ) : null}
                    {!thirdLearningObjectivesAssessmentExample || !secondLearningObjectivesAssessmentExample ? (
                      <Button
                        onClick={handleAddLearningObjectivesAssessmentExampleClick}
                        type="button"
                        variant="outlined"
                      >
                        {t('qualitydocument:addNewExample')}
                      </Button>
                    ) : null}
                  </Box>
                </Paper>
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
