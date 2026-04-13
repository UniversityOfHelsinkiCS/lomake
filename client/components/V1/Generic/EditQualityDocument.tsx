/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState, useEffect, useCallback } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'

import { useTranslation } from 'react-i18next'
import { useUpdateQualityDocumentMutation } from '@/client/redux/qualityDocuments'
import { useLockDocument } from '@/client/hooks/useLockDocument'
import { useNavigate } from 'react-router'

import { FeedbackSource, FormDataState, FeedbackRegularity } from '@/shared/lib/types'

import QualityForm, { defaultFeedbackSourceOptions, initFormData, initErrors } from './QualityForm'
import { validateQualityDocument } from '@/client/util/v1'

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

  const { componentRef, handleReleaseLock, isLockedByOther } = useLockDocument({
    room: programmeKey,
    field: id,
  })

  useEffect(() => {
    if (isLockedByOther) {
      handleReleaseLock()
      navigate(`/v1/programmes/10/${programmeKey}`)
    }
  }, [isLockedByOther, programmeKey, navigate, handleReleaseLock])

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

  const [errors, setErrors] = useState<Record<string, string>>(initErrors())

  const [formData, setFormData] = useState<FormDataState>(data)

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
      feedbackSources: formData.feedbackSources
        .filter(({ regularity }) => Boolean(regularity))
        .map(({ name, regularity, description }) => ({
          name,
          regularity,
          description,
        })),
    }
    if (validateForm(payload)) {
      updateDocument({ studyprogrammeKey: programmeKey, id, data: payload as any })
      handleReleaseLock()
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to clear form data from localStorage:', error)
      }
      navigate(`/v1/programmes/10/${programmeKey}`)
    }
  }

  if (!document.data) return <CircularProgress />

  return (
    <Box ref={componentRef} sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ mb: '4rem' }} variant="h3">{`${formData.title}`}</Typography>
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

export default EditQualityDocument
