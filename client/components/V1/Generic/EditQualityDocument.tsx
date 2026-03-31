/* eslint-disable @typescript-eslint/consistent-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState, Fragment } from 'react'
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
type FeedbackSourceState = Array<{ name: FeedbackSource; description?: string; regularity: FeedbackRegularity }>

interface FormDataState {
  title: string
  feedbackUtilization: string
  curriculumDevelopment: string
  guidancePolicies: string
  learningObjectivesAssessment: string
  otherFeedbackSource: string
  feedbackutilizationExamples: string
  feedbackSources: FeedbackSourceState
  learningObjectivesAssessmentRegularity: FeedbackRegularity
  [key: string]: any
}

const initFormData = (t: TFunction): FormDataState => {
  return {
    title: `${t('qualitydocument:header')} - ${new Date().toLocaleDateString('fi-FI')}`,
    feedbackUtilization: '',
    curriculumDevelopment: '',
    guidancePolicies: '',
    learningObjectivesAssessment: '',
    otherFeedbackSource: '',
    feedbackutilizationExamples: '',
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
  const STORAGE_KEY = `qualityForm_${programmeKey}`

  const data = document.data.formData ? document.data.formData : initFormData(t)

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
  const [secondGuidancePoliciesExample, setSecondGuidancePoliciesExample] = useState(true)
  const [thirdGuidancePoliciesExample, setThirdGuidancePoliciesExample] = useState(true)
  const [secondCurriculumDevelopmentExample, setSecondCurriculumDevelopmentExample] = useState(true)
  const [thirdCurriculumDevelopmentExample, setThirdCurriculumDevelopmentExample] = useState(true)
  const [secondLearningObjectivesAssessmentExample, setSecondLearningObjectivesAssessmentExample] = useState(true)
  const [thirdLearningObjectivesAssessmentExample, setThirdLearningObjectivesAssessmentExample] = useState(true)

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
        const [root, second, third] = issue.path

        if (typeof root === 'string' && fields.includes(root) && issue.path.length === 1) {
          setErrorOnce(root, issue.message)
          return
        }

        if (root === 'feedbackUtilization' && second === 'feedbackSources') {
          if (issue.path.length === 2) {
            setErrorOnce('feedbackUtilization', 'feedbackSourcesRequired')
            setErrorOnce('feedbackUtilizationFeedbackSources', 'feedbackSourcesRequired')
            return
          }

          if (typeof third === 'number') {
            const sourceName = payload.feedbackUtilization?.feedbackSources?.[third]?.name
            if (!sourceName || typeof sourceName !== 'string') return

            if (issue.path[3] === 'regularity') {
              setErrorOnce(`${sourceName}Regularity`, 'regularityRequired')
            }
            if (issue.path[3] === 'description') {
              setErrorOnce(`${sourceName}Description`, issue.message)
            }
          }
          return
        }

        if (root === 'learningObjectivesAssessment' && second === 'regularity') {
          setErrorOnce('learningObjectivesAssessmentRegularity', 'regularityRequired')
        }
      })

      setErrors(nextErrors)
    }
    return res.success
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const curriculumDevelopment = [
      {
        name: formData['curriculumDevelopmentName-example1'],
        changes: formData['curriculumDevelopmentChanges-example1'],
        feedbackSource: formData['curriculumDevelopmentFeedbackSource-example1'],
        communication: formData['curriculumDevelopmentCommunication-example1'],
      },
      {
        name: formData['curriculumDevelopmentName-example2'],
        changes: formData['curriculumDevelopmentChanges-example2'],
        feedbackSource: formData['curriculumDevelopmentFeedbackSource-example2'],
        communication: formData['curriculumDevelopmentCommunication-example2'],
      },
      {
        name: formData['curriculumDevelopmentName-example3'],
        changes: formData['curriculumDevelopmentChanges-example3'],
        feedbackSource: formData['curriculumDevelopmentFeedbackSource-example3'],
        communication: formData['curriculumDevelopmentCommunication-example3'],
      },
    ].filter(
      example =>
        example.name?.length > 0 ||
        example.changes?.length > 0 ||
        example.feedbackSource?.length > 0 ||
        example.communication?.length > 0
    )

    const guidancePolicies = [
      {
        name: formData['guidancePoliciesName-example1'],
        changes: formData['guidancePoliciesChanges-example1'],
        feedbackSource: formData['guidancePoliciesFeedbackSource-example1'],
        communication: formData['guidancePoliciesCommunication-example1'],
      },
      {
        name: formData['guidancePoliciesName-example2'],
        changes: formData['guidancePoliciesChanges-example2'],
        feedbackSource: formData['guidancePoliciesFeedbackSource-example2'],
        communication: formData['guidancePoliciesCommunication-example2'],
      },
      {
        name: formData['guidancePoliciesName-example3'],
        changes: formData['guidancePoliciesChanges-example3'],
        feedbackSource: formData['guidancePoliciesFeedbackSource-example3'],
        communication: formData['guidancePoliciesCommunication-example3'],
      },
    ].filter(
      example =>
        example.name?.length > 0 ||
        example.changes?.length > 0 ||
        example.feedbackSource?.length > 0 ||
        example.communication?.length > 0
    )

    const learningObjectivesAssessmentExamples = [
      {
        name: formData['learningObjectivesAssessmentName-example1'],
        changes: formData['learningObjectivesAssessmentChanges-example1'],
        feedbackSource: formData['learningObjectivesAssessmentFeedbackSource-example1'],
        communication: formData['learningObjectivesAssessmentCommunication-example1'],
      },
      {
        name: formData['learningObjectivesAssessmentName-example2'],
        changes: formData['learningObjectivesAssessmentChanges-example2'],
        feedbackSource: formData['learningObjectivesAssessmentFeedbackSource-example2'],
        communication: formData['learningObjectivesAssessmentCommunication-example2'],
      },
      {
        name: formData['learningObjectivesAssessmentName-example3'],
        changes: formData['learningObjectivesAssessmentChanges-example3'],
        feedbackSource: formData['learningObjectivesAssessmentFeedbackSource-example3'],
        communication: formData['learningObjectivesAssessmentCommunication-example3'],
      },
    ].filter(
      example =>
        example.name?.length > 0 ||
        example.changes?.length > 0 ||
        example.feedbackSource?.length > 0 ||
        example.communication?.length > 0
    )

    const payload: Record<string, any> = {
      title: formData.title,
      feedbackUtilization: {
        feedbackSources: formData.feedbackSources.map(({ name, regularity, description }) => ({
          name,
          regularity,
          description,
        })),
        examples: formData.feedbackutilizationExamples,
      },
      curriculumDevelopment,
      guidancePolicies,

      learningObjectivesAssessment: {
        description: formData.learningObjectivesAssessment,
        regularity: formData.learningObjectivesAssessmentRegularity,
        learningObjectivesAssessmentExamples,
      },
      formData,
    }
    if (validateForm(payload)) {
      updateDocument({ studyprogrammeKey: programmeKey, id, data: payload as any })
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

  if (!document.data.formData) return <CircularProgress />

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ mb: '4rem' }} variant="h3">
        {`${data.title}`}
      </Typography>
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Typography variant="h5">{t('qualitydocument:feedbackUtilizationHeader')}</Typography>
                    <Typography variant="light">{t('qualitydocument:feedbackUtilizationExamples')}</Typography>
                    <TextField
                      data-cy={`feedbackutilization-examples`}
                      error={!!errors.feedbackutilizationExamples}
                      fullWidth
                      helperText={errors.feedbackutilizationExamples}
                      label={t(`qualitydocument:examplesDescription`)}
                      margin="normal"
                      minRows={3}
                      multiline
                      name={`feedbackutilizationExamples`}
                      onChange={handleChange}
                      value={formData.feedbackutilizationExamples}
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
                    example="example1"
                    field={field}
                    formData={formData}
                    handleChange={handleChange}
                    setExample={setSecondCurriculumDevelopmentExample}
                  />
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
                    example="example1"
                    field={field}
                    formData={formData}
                    handleChange={handleChange}
                    setExample={setSecondGuidancePoliciesExample}
                  />
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
                    example="example1"
                    field={field}
                    formData={formData}
                    handleChange={handleChange}
                    setExample={setSecondLearningObjectivesAssessmentExample}
                  />
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
