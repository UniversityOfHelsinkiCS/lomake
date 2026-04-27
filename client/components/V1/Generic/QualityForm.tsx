/* eslint-disable @typescript-eslint/consistent-return */
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import FeedbackUtilization from './FeedbackUtilizationComponent'
import FeedbackActionForm from './FeedbackActionComponent'
import { FeedbackSource, FormDataState, FeedbackRegularity, FeedbackSourceState } from '@/shared/lib/types'
import CharacterCounter from './Charactercounter'
import { customColors } from '@/theme'
import { TFunction } from 'i18next'

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
  borderLeft: `8px solid`,
  padding: '1.25rem 2rem',
  borderLeftColor: 'lightblue',
}

const sectionContentSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4rem',
  padding: '2rem',
}

export const fields = [
  'title',
  'feedbackUtilization',
  'curriculumDevelopment',
  'guidancePolicies',
  'learningObjectivesAssessment',
]

export const defaultFeedbackSourceOptions = [
  'norppa',
  'howULearn',
  'careerMonitoring',
  'bachelorFeedback',
  'feedbackFromEmployers',
]

export const feedbackRegularityOptions: FeedbackRegularity[] = [
  'notUsed',
  'lessFrequently',
  'perCurriculumCycle',
  'annually',
  'everySemester',
  'moreFrequently',
]

const isDefaultFeedbackSource = (source: FeedbackSource) =>
  defaultFeedbackSourceOptions.some(defaultSource => defaultSource.toLowerCase() === source.toLowerCase())

const getFeedbackSourceLabel = (t: TFunction, source: FeedbackSource) => {
  const translatedLabel = t(`qualitydocument:${source}`)
  return translatedLabel.startsWith('qualitydocument:') ? source : translatedLabel
}

export const initFormData = (t: TFunction): FormDataState => {
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

export const initErrors = (): Record<string, string> => {
  return fields.reduce(
    (acc, field) => {
      acc[field] = ''
      return acc
    },
    {} as Record<string, string>
  )
}

const QualityForm = ({
  errors,
  handleSubmit,
  feedbackSourceOptions,
  formData,
  setFeedbackSourceOptions,
  setFormData,
  secondCurriculumDevelopmentExample,
  setSecondCurriculumDevelopmentExample,
  thirdCurriculumDevelopmentExample,
  setThirdCurriculumDevelopmentExample,
  secondGuidancePoliciesExample,
  setSecondGuidancePoliciesExample,
  thirdGuidancePoliciesExample,
  setThirdGuidancePoliciesExample,
  secondLearningObjectivesAssessmentExample,
  setSecondLearningObjectivesAssessmentExample,
  thirdLearningObjectivesAssessmentExample,
  setThirdLearningObjectivesAssessmentExample,
}: {
  errors: Record<string, string>
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  feedbackSourceOptions: FeedbackSource[]
  formData: FormDataState
  setFeedbackSourceOptions: React.Dispatch<React.SetStateAction<FeedbackSource[]>>
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>
  secondCurriculumDevelopmentExample: boolean
  setSecondCurriculumDevelopmentExample: React.Dispatch<React.SetStateAction<boolean>>
  thirdCurriculumDevelopmentExample: boolean
  setThirdCurriculumDevelopmentExample: React.Dispatch<React.SetStateAction<boolean>>
  secondGuidancePoliciesExample: boolean
  setSecondGuidancePoliciesExample: React.Dispatch<React.SetStateAction<boolean>>
  thirdGuidancePoliciesExample: boolean
  setThirdGuidancePoliciesExample: React.Dispatch<React.SetStateAction<boolean>>
  secondLearningObjectivesAssessmentExample: boolean
  setSecondLearningObjectivesAssessmentExample: React.Dispatch<React.SetStateAction<boolean>>
  thirdLearningObjectivesAssessmentExample: boolean
  setThirdLearningObjectivesAssessmentExample: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { t } = useTranslation()

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

    setFormData(prevData => {
      if (prevData.feedbackSources.some(source => source.name.toLowerCase() === newSource.toLowerCase())) {
        return {
          ...prevData,
          otherFeedbackSource: '',
        } as FormDataState
      }

      return {
        ...prevData,
        feedbackSources: [...prevData.feedbackSources, { name: newSource, regularity: '', description: '' }],
        otherFeedbackSource: '',
      } as FormDataState
    })
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

  const setSourceRegularity = (feedbacksource: FeedbackSource, regularity: FeedbackRegularity) => {
    setFormData(prevData => {
      const { feedbackSources } = prevData
      const index = feedbackSources.findIndex(f => f.name.toLowerCase() === feedbacksource.toLowerCase())

      if (index === -1) {
        return {
          ...prevData,
          feedbackSources: [...feedbackSources, { name: feedbacksource, regularity, description: '' }],
        } as FormDataState
      }

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
      const index = feedbackSources.findIndex(f => f.name.toLowerCase() === feedbacksource.toLowerCase())

      if (index === -1) {
        return {
          ...prevData,
          feedbackSources: [...feedbackSources, { name: feedbacksource, regularity: '', description }],
        } as FormDataState
      }

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
    <form onSubmit={handleSubmit}>
      <Typography style={{ color: 'red' }} variant="regular">
        {t('qualitydocument:unsavedChangesWarning2')}
      </Typography>
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
                  <TableContainer sx={{ border: `1px solid ${customColors.grayLight}`, borderRadius: 2 }}>
                    <Table size="small" sx={{ minWidth: 900 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}></TableCell>
                          {feedbackRegularityOptions.map(option => {
                            const regularityLabel = t(`qualitydocument:${option}`)

                            return (
                              <TableCell align="center" key={option} sx={{ fontWeight: 700 }}>
                                <Tooltip
                                  arrow
                                  placement="top"
                                  title={
                                    <span style={{ whiteSpace: 'pre-line', fontSize: '15px' }}>{regularityLabel}</span>
                                  }
                                >
                                  <span
                                    style={{
                                      whiteSpace: 'pre-line',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {regularityLabel}
                                  </span>
                                </Tooltip>
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {feedbackSourceOptions.map(source => {
                          const sourceState = formData.feedbackSources.find(
                            f => f.name.toLowerCase() === source.toLowerCase()
                          )

                          return (
                            <TableRow hover key={source}>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
                                  {getFeedbackSourceLabel(t, source)}
                                  {!isDefaultFeedbackSource(source) ? (
                                    <Tooltip
                                      arrow
                                      placement="right"
                                      title={<div style={{ fontSize: '15px' }}>{t('qualitydocument:remove')}</div>}
                                    >
                                      <IconButton
                                        aria-label={t('qualitydocument:remove')}
                                        onClick={() => removeFeedbackSource(source)}
                                        size="small"
                                        type="button"
                                      >
                                        <DeleteOutlineIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  ) : null}
                                </Box>
                              </TableCell>
                              {feedbackRegularityOptions.map(option => (
                                <TableCell align="center" key={`${source}-${option}`}>
                                  <Radio
                                    checked={
                                      sourceState?.regularity
                                        ? sourceState?.regularity === option
                                        : option === 'notUsed'
                                    }
                                    onChange={() => setSourceRegularity(source, option)}
                                    size="small"
                                    slotProps={{ input: { 'aria-label': `${source}-${option}` } }}
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                      sx={{ minWidth: '300px' }}
                      value={formData.otherFeedbackSource ?? ''}
                      variant="outlined"
                    />
                    <Button onClick={addNewFeedbackSource} type="button" variant="outlined">
                      {t('qualitydocument:addNew')}
                    </Button>
                  </Box>
                  {feedbackSourceOptions.filter(source => !isDefaultFeedbackSource(source)).length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {feedbackSourceOptions
                        .filter(source => !isDefaultFeedbackSource(source))
                        .some(source => {
                          const sourceState = formData.feedbackSources.find(
                            f => f.name.toLowerCase() === source.toLowerCase()
                          )
                          return sourceState?.regularity !== '' && sourceState?.regularity !== 'notUsed'
                        }) && (
                        <Typography variant="h5">{t(`qualitydocument:otherFeedbackSourceDescription`)}</Typography>
                      )}

                      {feedbackSourceOptions
                        .filter(source => !isDefaultFeedbackSource(source))
                        .map(source => {
                          const sourceState = formData.feedbackSources.find(
                            f => f.name.toLowerCase() === source.toLowerCase()
                          )

                          return sourceState?.regularity !== '' && sourceState?.regularity !== 'notUsed' ? (
                            <FeedbackUtilization
                              description={sourceState?.description ?? ''}
                              errors={errors}
                              feedbackSource={source}
                              key={source}
                              setDescription={(value: string) => setSourceDescription(source, value)}
                            />
                          ) : null
                        })}
                    </Box>
                  ) : null}
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
                    setFormData={setFormData}
                  />
                  {secondCurriculumDevelopmentExample ? (
                    <FeedbackActionForm
                      errors={errors}
                      example="2"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setSecondCurriculumDevelopmentExample}
                      setFormData={setFormData}
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
                      setFormData={setFormData}
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
                    setFormData={setFormData}
                  />
                  {secondGuidancePoliciesExample ? (
                    <FeedbackActionForm
                      errors={errors}
                      example="2"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setSecondGuidancePoliciesExample}
                      setFormData={setFormData}
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
                      setFormData={setFormData}
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
                    setFormData={setFormData}
                  />
                  {secondLearningObjectivesAssessmentExample ? (
                    <FeedbackActionForm
                      errors={errors}
                      example="2"
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setExample={setSecondLearningObjectivesAssessmentExample}
                      setFormData={setFormData}
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
                      setFormData={setFormData}
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
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right' }}>
          <Box sx={{ mt: '1rem' }}>
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
            <br />
            <Typography style={{ color: 'red' }} variant="regular">
              {t('qualitydocument:documentUnsavedRelease')}
            </Typography>
          </Box>
        </div>
      </div>
    </form>
  )
}

export default QualityForm
