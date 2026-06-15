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
import { FeedbackSource, FormDataState, FeedbackRegularity, FeedbackSourceState } from '../../../../shared/lib/types'
import CharacterCounter from './Charactercounter'
import { customColors } from '../../../../theme'
import { TFunction } from 'i18next'
import Examples from './ExamplesComponent'

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

export const fields = ['title', 'feedback', 'curriculum', 'guidance', 'learning']

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
    feedback: '',
    curriculum: '',
    guidance: '',
    learning: '',
    otherFeedbackSource: '',
    feedbackExamples: '',
    feedbackSources: [] as FeedbackSourceState,
    learningRegularity: '' as FeedbackRegularity,
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
}: {
  errors: Record<string, string>
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  feedbackSourceOptions: FeedbackSource[]
  formData: FormDataState
  setFeedbackSourceOptions: React.Dispatch<React.SetStateAction<FeedbackSource[]>>
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>
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

  const noSelectedFeedbackSources =
    formData.feedbackSources.length === 0 ||
    formData.feedbackSources.every(source => source.regularity === 'notUsed' || source.regularity === '')

  const isEmptyForm = () => {
    const { title: _title, ...formDataWithoutTitle } = formData

    const areAllStringFieldsEmpty = Object.values(formDataWithoutTitle).every(
      value => typeof value !== 'string' || value.trim() === ''
    )

    return areAllStringFieldsEmpty && noSelectedFeedbackSources
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
                                  title={<span style={{ whiteSpace: 'pre-line' }}>{regularityLabel}</span>}
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
                                    <Tooltip arrow placement="right" title={<div>{t('qualitydocument:remove')}</div>}>
                                      <IconButton
                                        aria-label={t('qualitydocument:remove')}
                                        data-cy={`remove-${source}`}
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
                                    data-cy={`radio-${source}-${option}`}
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

                  <Box sx={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <TextField
                      data-cy={`otherFeedbackSource`}
                      label={t(`qualitydocument:otherFeedbackSource`)}
                      name={'otherFeedbackSource'}
                      onChange={handleChange}
                      slotProps={{ htmlInput: { maxLength: 50 } }}
                      sx={{ minWidth: '300px' }}
                      value={formData.otherFeedbackSource ?? ''}
                      variant="outlined"
                    />
                    <Button
                      data-cy="add-new-feedbackSource"
                      onClick={addNewFeedbackSource}
                      type="button"
                      variant="outlined"
                    >
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
                    <Typography variant="light">{t('qualitydocument:feedbackExamples')}</Typography>
                    <TextField
                      data-cy={`feedback-examples`}
                      error={!!errors.feedbackExamples}
                      fullWidth
                      helperText={<CharacterCounter count={formData.feedbackExamples.length} maxLength={1500} />}
                      label={t(`qualitydocument:examplesDescription`)}
                      margin="normal"
                      minRows={3}
                      multiline
                      name={`feedbackExamples`}
                      onChange={handleChange}
                      slotProps={{ htmlInput: { maxLength: 1500 } }}
                      value={formData.feedbackExamples}
                    />
                  </Box>
                </Box>
              </Paper>
            )
          } else if (index === 2) {
            return (
              <Paper key={field} sx={sectionCardSx}>
                <Box sx={sectionHeaderSx}>
                  <Typography variant="h3">{t('qualitydocument:curriculumHeader')}</Typography>
                </Box>

                <Box sx={sectionContentSx}>
                  <Examples
                    errors={errors}
                    field={field}
                    formData={formData}
                    handelChange={handleChange}
                    setFormData={setFormData}
                  />
                </Box>
              </Paper>
            )
          } else if (index === 3) {
            return (
              <Paper key={field} sx={sectionCardSx}>
                <Box sx={sectionHeaderSx}>
                  <Typography variant="h3">{t('qualitydocument:guidanceHeader')}</Typography>
                </Box>
                <Box sx={sectionContentSx}>
                  <Examples
                    errors={errors}
                    field={field}
                    formData={formData}
                    handelChange={handleChange}
                    setFormData={setFormData}
                  />
                </Box>
              </Paper>
            )
          } else if (index === 4) {
            return (
              <Paper key={field} sx={sectionCardSx}>
                <Box sx={sectionHeaderSx}>
                  <Typography variant="h3">{t('qualitydocument:learningHeader')}</Typography>
                </Box>
                <Box sx={sectionContentSx}>
                  <TextField
                    data-cy={`${field}`}
                    error={!!errors[`${field}`]}
                    helperText={errors[`${field}`]}
                    label={t(`qualitydocument:learning`)}
                    margin="normal"
                    minRows={2}
                    multiline
                    name={`${field}`}
                    onChange={handleChange}
                    value={formData[`${field}`]}
                    variant="outlined"
                  />
                  <Typography variant="light">{t('qualitydocument:learningRegularity')}</Typography>
                  <RadioGroup
                    aria-label="learningRegularity"
                    data-cy="regularity-learning"
                    name="learningRegularity"
                    onChange={e =>
                      setFormData(
                        prevData =>
                          ({
                            ...prevData,
                            learningRegularity: e.target.value as FeedbackRegularity,
                          }) as FormDataState
                      )
                    }
                    value={formData.learningRegularity}
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
                  <Examples
                    errors={errors}
                    field={field}
                    formData={formData}
                    handelChange={handleChange}
                    setFormData={setFormData}
                  />
                </Box>
              </Paper>
            )
          }
        })}
        {formData.learningRegularity === '' || noSelectedFeedbackSources ? (
          <Typography sx={{ fontSize: '1.1rem' }} variant="h6">
            {t('qualitydocument:requiredFields')}
          </Typography>
        ) : null}
        {noSelectedFeedbackSources ? (
          <Typography sx={{ color: 'error.main', fontSize: '1.1rem' }} variant="body2">
            <li style={{ color: 'black', marginLeft: '2.5rem' }}>
              <span style={{ color: 'red' }}>{t('qualitydocument:feedbackSourcesRequired')}</span>
            </li>
          </Typography>
        ) : null}
        {formData.learningRegularity === '' ? (
          <Typography sx={{ color: 'error.main', fontSize: '1.1rem' }} variant="body2">
            <li style={{ color: 'black', marginLeft: '2.5rem' }}>
              <span style={{ color: 'red' }}>{t('qualitydocument:regularityRequired')}</span>
            </li>
          </Typography>
        ) : null}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'left' }}>
          <Box sx={{ mt: '1rem' }}>
            <Button
              color="primary"
              data-cy="save-document"
              disabled={isEmptyForm()}
              key="submit"
              sx={{ alignSelf: 'flex-end' }}
              type="submit"
              variant="contained"
            >
              {t('document:submit')}
            </Button>
            <br />
            {!isEmptyForm() ? (
              <Typography variant="regular">{t('qualitydocument:documentUnsavedRelease')}</Typography>
            ) : null}
          </Box>
        </div>
      </div>
    </form>
  )
}

export default QualityForm
