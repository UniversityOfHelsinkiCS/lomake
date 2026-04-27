/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'

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
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const LOCK_FIELD = `${programmeKey}-quality-edit_${id}`
  // const AUTOSAVE_INTERVAL_MS = 5 * 60 * 1000
  const AUTOSAVE_INTERVAL_MS = 10 * 1000

  const { componentRef, handleReleaseLock, isLockedByOther, isLockedByCurrentUser } = useLockDocument({
    room: programmeKey,
    field: LOCK_FIELD,
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
  const [lastAutosaveAt, setLastAutosaveAt] = useState<Date | null>(null)
  const [isAutosaving, setIsAutosaving] = useState(false)
  const [autosaveError, setAutosaveError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormDataState>(data)
  const latestFormDataRef = useRef<FormDataState>(data)
  const isInitializedFromBackendRef = useRef(false)

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
    latestFormDataRef.current = formData
  }, [formData])

  useEffect(() => {
    isInitializedFromBackendRef.current = false
    setLastAutosaveAt(null)
    setAutosaveError(null)
    setIsAutosaving(false)
  }, [id])

  const formattedLastAutosave = useMemo(() => {
    if (!lastAutosaveAt) return null

    return new Intl.DateTimeFormat(i18n.language, {
      timeStyle: 'medium',
    }).format(lastAutosaveAt)
  }, [lastAutosaveAt, i18n.language])

  useEffect(() => {
    if (!document.data) return
    if (isInitializedFromBackendRef.current) {
      return
    }

    const backendData = normalizeFormData(document.data)
    const nextData = backendData
    latestFormDataRef.current = nextData
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
    isInitializedFromBackendRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, normalizeFormData, t])

  const validateForm = useCallback(
    (payload: Record<string, any>) => {
      const validationErrors = validateQualityDocument(payload, t)
      if (validationErrors) {
        setErrors(validationErrors)
        return false
      }
      return true
    },
    [t]
  )

  const formatPayload = useCallback((sourceFormData: FormDataState = latestFormDataRef.current) => {
    const {
      curriculumDevelopment: _curriculumDevelopment,
      guidancePolicies: _guidancePolicies,
      feedbackUtilization: _feedbackUtilization,
      otherFeedbackSource: _otherFeedbackSource,
      ...restFormData
    } = sourceFormData

    const payload: Record<string, any> = {
      ...restFormData,
      feedbackSources: sourceFormData.feedbackSources
        .filter(({ regularity }) => regularity && regularity !== 'notUsed')
        .map(({ name, regularity, description }) => ({
          name,
          regularity,
          description,
        })),
    }
    return payload
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!isLockedByCurrentUser) return

    const payload = formatPayload()
    if (validateForm(payload)) {
      updateDocument({ studyprogrammeKey: programmeKey, id, data: payload as any })
      handleReleaseLock()
      navigate(`/v1/programmes/10/${programmeKey}`)
    }
  }

  useEffect(() => {
    let intervalId: number | null = null

    if (isLockedByCurrentUser) {
      intervalId = window.setInterval(() => {
        const payload = formatPayload(latestFormDataRef.current)

        setIsAutosaving(true)
        void updateDocument({ studyprogrammeKey: programmeKey, id, data: payload as any })
          .unwrap()
          .then(() => {
            setLastAutosaveAt(new Date())
            setAutosaveError(null)
          })
          .catch(() => {
            setAutosaveError(t('generic:autosaveError'))
          })
          .finally(() => {
            setIsAutosaving(false)
          })
      }, AUTOSAVE_INTERVAL_MS)
    }

    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLockedByCurrentUser])

  if (!document.data) return <CircularProgress />

  if (!isLockedByCurrentUser) return null

  return (
    <Box ref={componentRef} sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ mb: '4rem' }} variant="h3">{`${formData.title}`}</Typography>
      <Box sx={{ alignSelf: 'flex-end', position: 'sticky', top: 16, zIndex: 1, mb: '1.5rem', minHeight: '3.5rem' }}>
        {isAutosaving ? <Alert severity="info">{t('generic:saving')}</Alert> : null}
        {!isAutosaving && Boolean(autosaveError) ? <Alert severity="warning">{autosaveError}</Alert> : null}
        {!isAutosaving && !autosaveError && Boolean(formattedLastAutosave) ? (
          <Alert severity="success">{t(`generic:autosave`, { time: formattedLastAutosave })}</Alert>
        ) : null}
      </Box>
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
