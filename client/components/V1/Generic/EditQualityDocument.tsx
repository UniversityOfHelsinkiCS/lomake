/* eslint-disable @typescript-eslint/consistent-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState, Fragment, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material'

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Checkbox } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { QualityDocumentFormSchema } from '@/shared/validators'
import { useUpdateQualityDocumentMutation } from '@/client/redux/qualityDocuments'
import { TFunction } from 'i18next'
import { useNavigate } from 'react-router'
import FeedbackUtilization from './FeedbackUtilizationComponent'
import FeedbackActionForm from './FeedbackActionComponent'
import { FeedbackSource, FormDataState, FeedbackSourceState, FeedbackRegularity } from '@/shared/lib/types'
import CharacterCounter from './Charactercounter'

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
  const STORAGE_KEY = `qualityFormEdit_${programmeKey}_${id}`

  const normalizeFormData = useCallback(
    (backendData: Record<string, any>): FormDataState => {
      const normalized = { ...backendData } as FormDataState
      if (!Array.isArray(normalized.feedbackSources)) {
        normalized.feedbackSources = []
      }
      if (!normalized.title) normalized.title = initFormData(t).title
      if (!normalized.feedbackUtilizationExamples) normalized.feedbackUtilizationExamples = ''
      if (!normalized.learningObjectivesAssessmentRegularity)
        normalized.learningObjectivesAssessmentRegularity = '' as FeedbackRegularity
      if (!normalized.otherFeedbackSource) normalized.otherFeedbackSource = ''

      return normalized
    },
    [t]
  )

  const getCachedFormData = useCallback((): FormDataState | null => {
    try {
      const cachedRaw = localStorage.getItem(STORAGE_KEY)
      if (!cachedRaw) return null
      return normalizeFormData(JSON.parse(cachedRaw) as Record<string, any>)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to read form data from localStorage:', error)
      return null
    }
  }, [normalizeFormData, STORAGE_KEY])

  const hasExample = (sourceData: Record<string, any>, field: string, exampleNum: number): boolean => {
    return !!(
      sourceData?.[`${field}NameExample${exampleNum}`] ||
      sourceData?.[`${field}ChangesExample${exampleNum}`] ||
      sourceData?.[`${field}FeedbackSourceExample${exampleNum}`] ||
      sourceData?.[`${field}CommunicationExample${exampleNum}`]
    )
  }

  const data = document.data ? normalizeFormData(document.data) : initFormData(t)

  const [updateDocument] = useUpdateQualityDocumentMutation()

  const [formData, setFormData] = useState<FormDataState>(data)

  const [errors, setErrors] = useState<Record<string, string>>(initErrors())

  const [feedbackSourceOptions, setFeedbackSourceOptions] = useState<FeedbackSource[]>(
    defaultFeedbackSourceOptions.concat(
      data.feedbackSources
        ?.map((option: { name: FeedbackSource }) => option.name)
        .filter((name: FeedbackSource) => !defaultFeedbackSourceOptions.includes(name)) ?? []
    )
  )
  const [secondGuidancePoliciesExample, setSecondGuidancePoliciesExample] = useState(
    hasExample(data, 'guidancePolicies', 2)
  )
  const [thirdGuidancePoliciesExample, setThirdGuidancePoliciesExample] = useState(
    hasExample(data, 'guidancePolicies', 3)
  )
  const [secondCurriculumDevelopmentExample, setSecondCurriculumDevelopmentExample] = useState(
    hasExample(data, 'curriculumDevelopment', 2)
  )
  const [thirdCurriculumDevelopmentExample, setThirdCurriculumDevelopmentExample] = useState(
    hasExample(data, 'curriculumDevelopment', 3)
  )
  const [secondLearningObjectivesAssessmentExample, setSecondLearningObjectivesAssessmentExample] = useState(
    hasExample(data, 'learningObjectivesAssessment', 2)
  )
  const [thirdLearningObjectivesAssessmentExample, setThirdLearningObjectivesAssessmentExample] = useState(
    hasExample(data, 'learningObjectivesAssessment', 3)
  )

  useEffect(() => {
    if (!document.data) return

    const nextData = getCachedFormData() ?? normalizeFormData(document.data)
    setFormData(nextData)
    setFeedbackSourceOptions(
      defaultFeedbackSourceOptions.concat(
        nextData.feedbackSources
          ?.map((option: { name: FeedbackSource }) => option.name)
          .filter((name: FeedbackSource) => !defaultFeedbackSourceOptions.includes(name)) ?? []
      )
    )
    setSecondGuidancePoliciesExample(hasExample(nextData, 'guidancePolicies', 2))
    setThirdGuidancePoliciesExample(hasExample(nextData, 'guidancePolicies', 3))
    setSecondCurriculumDevelopmentExample(hasExample(nextData, 'curriculumDevelopment', 2))
    setThirdCurriculumDevelopmentExample(hasExample(nextData, 'curriculumDevelopment', 3))
    setSecondLearningObjectivesAssessmentExample(hasExample(nextData, 'learningObjectivesAssessment', 2))
    setThirdLearningObjectivesAssessmentExample(hasExample(nextData, 'learningObjectivesAssessment', 3))
  }, [document.data, getCachedFormData, normalizeFormData, t, STORAGE_KEY])

  useEffect(() => {
    if (!document.data) return

    try {
      if (JSON.stringify(formData) === JSON.stringify(data)) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save form data to localStorage:', error)
    }
  }, [formData, data, document.data, STORAGE_KEY])

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
      updateDocument({ studyprogrammeKey: programmeKey, id, data: payload as any })
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

  if (!document.data) return <CircularProgress />

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ mb: '4rem' }} variant="h3">{`${formData.title}`}</Typography>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {fields.map((field, index) => {
            if (index === 1) {
              return (
                <Fragment key={field}>
                  <Typography variant="h3">{t('qualitydocument:feedbackHeader')}</Typography>
                  <Typography variant="light">{t('qualitydocument:feedbackSource')}</Typography>
                  {feedbackSourceOptions.map(source => {
                    const sourceState = formData.feedbackSources.find(f => f.name === source)
                    const isChecked = Boolean(sourceState)

                    return (
                      <Fragment key={source}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Checkbox
                            checked={sourceState ? true : false}
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
                </Fragment>
              )
            } else if (index === 2) {
              return (
                <Fragment key={field}>
                  <br />
                  <Typography variant="h3">{t('qualitydocument:curriculumDevelopmentHeader')}</Typography>
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
                </Fragment>
              )
            } else if (index === 3) {
              return (
                <Fragment key={field}>
                  <br />
                  <Typography variant="h3">{t('qualitydocument:guidancePoliciesHeader')}</Typography>
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
                </Fragment>
              )
            } else if (index === 4) {
              return (
                <Fragment key={field}>
                  <br />
                  <Typography variant="h3">{t('qualitydocument:learningObjectivesAssessmentHeader')}</Typography>

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
                  <Typography variant="light">{t('qualitydocument:learningObjectivesAssessmentRegularity')}</Typography>
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
