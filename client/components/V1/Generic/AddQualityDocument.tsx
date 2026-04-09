/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'

import { useTranslation } from 'react-i18next'

import { useNavigate } from 'react-router'

import { useCreateQualityDocumentMutation } from '@/client/redux/qualityDocuments'
import { useAppSelector } from '@/client/util/hooks'

import { FeedbackSource, FormDataState } from '@/shared/lib/types'

import QualityForm, { defaultFeedbackSourceOptions, initFormData, initErrors } from './QualityForm'
import { validateQualityDocument } from '@/client/util/v1'

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

const AddQualityDocument = ({ programmeKey }: { programmeKey: string }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const STORAGE_KEY = `qualityFormCreate_${programmeKey}`
  const [errors, setErrors] = useState<Record<string, string>>(initErrors())
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

  const validateForm = (payload: Record<string, any> = formData) => {
    const validationErrors = validateQualityDocument(payload, t)
    if (validationErrors) {
      setErrors(validationErrors)
      return false
    }
    return true
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ mb: '4rem' }} variant="h2">
        {t('qualitydocument:header')} - {`${new Date().toLocaleDateString('fi-FI')}`}
      </Typography>
      <QualityForm
        errors={errors}
        feedbackSourceOptions={feedbackSourceOptions}
        formData={formData}
        handleSubmit={handleSubmit}
        secondCurriculumDevelopmentExample={secondCurriculumDevelopmentExample}
        secondGuidancePoliciesExample={secondGuidancePoliciesExample}
        secondLearningObjectivesAssessmentExample={secondLearningObjectivesAssessmentExample}
        setFeedbackSourceOptions={setFeedbackSourceOptions}
        setFormData={setFormData}
        setSecondCurriculumDevelopmentExample={setSecondCurriculumDevelopmentExample}
        setSecondGuidancePoliciesExample={setSecondGuidancePoliciesExample}
        setSecondLearningObjectivesAssessmentExample={setSecondLearningObjectivesAssessmentExample}
        setThirdCurriculumDevelopmentExample={setThirdCurriculumDevelopmentExample}
        setThirdGuidancePoliciesExample={setThirdGuidancePoliciesExample}
        setThirdLearningObjectivesAssessmentExample={setThirdLearningObjectivesAssessmentExample}
        thirdCurriculumDevelopmentExample={thirdCurriculumDevelopmentExample}
        thirdGuidancePoliciesExample={thirdGuidancePoliciesExample}
        thirdLearningObjectivesAssessmentExample={thirdLearningObjectivesAssessmentExample}
      />
    </Box>
  )
}

export default AddQualityDocument
