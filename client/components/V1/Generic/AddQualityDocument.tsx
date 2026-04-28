/* eslint-disable @typescript-eslint/no-misused-promises */

/* eslint-disable @typescript-eslint/no-floating-promises */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'

import { useTranslation } from 'react-i18next'

import { useNavigate } from 'react-router'

import {
  useCreateQualityDocumentMutation,
  useGetQualityDocumentsQuery,
  useUpdateQualityDocumentMutation,
} from '@/client/redux/qualityDocuments'

import { useLockDocument } from '@/client/hooks/useLockDocument'

import { FeedbackSource, FormDataState } from '@/shared/lib/types'

import QualityForm, { defaultFeedbackSourceOptions, initFormData, initErrors } from './QualityForm'
import { validateQualityDocument } from '@/client/util/v1'
import { QualityDocumentType } from '@/client/lib/types'

const AddQualityDocument = ({ programmeKey }: { programmeKey: string }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const LOCK_FIELD = `${programmeKey}-quality-draft`
  const AUTOSAVE_INTERVAL_MS = 5 * 60 * 1000

  const [errors, setErrors] = useState<Record<string, string>>(initErrors())
  const [createDocument] = useCreateQualityDocumentMutation()
  const [updateDocument] = useUpdateQualityDocumentMutation()

  const [id, setId] = useState<string | null>(null)
  const autosaveInFlightRef = useRef(false)

  const [formData, setFormData] = useState<FormDataState>(initFormData(t))
  const latestFormDataRef = useRef<FormDataState>(initFormData(t))

  const selectedYear = new Date().getFullYear()

  const { data: documents = [], isLoading, refetch } = useGetQualityDocumentsQuery({ studyprogrammeKey: programmeKey })

  const hasDocumentForYear = documents.some((doc: QualityDocumentType) => doc.year == selectedYear)

  const [feedbackSourceOptions, setFeedbackSourceOptions] = useState<FeedbackSource[]>(defaultFeedbackSourceOptions)
  const [secondGuidanceExample, setSecondGuidanceExample] = useState(false)
  const [thirdGuidanceExample, setThirdGuidanceExample] = useState(false)
  const [secondCurriculumExample, setSecondCurriculumExample] = useState(false)
  const [thirdCurriculumExample, setThirdCurriculumExample] = useState(false)
  const [secondLearningExample, setSecondLearningExample] = useState(false)
  const [thirdLearningExample, setThirdLearningExample] = useState(false)

  const { componentRef, handleReleaseLock, isLockedByOther, isLockedByCurrentUser } = useLockDocument({
    room: programmeKey,
    field: LOCK_FIELD,
  })

  useEffect(() => {
    latestFormDataRef.current = formData
  }, [formData])

  useEffect(() => {
    if (isLockedByOther) {
      handleReleaseLock()
      navigate(`/v1/programmes/10/${programmeKey}`)
    }
  }, [isLockedByOther, programmeKey, navigate, handleReleaseLock])

  const formatPayload = useCallback((sourceFormData: FormDataState = latestFormDataRef.current) => {
    const {
      curriculum: _curriculum,
      guidance: _guidance,
      feedback: _feedback,
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

  const hasExistingDocumentForSelectedYear = useCallback(async () => {
    const latestDocuments = await refetch().unwrap()
    return latestDocuments.some((doc: QualityDocumentType) => Number(doc.year) === selectedYear)
  }, [refetch, selectedYear])

  const validateForm = useCallback(
    (payload: Record<string, any> = formData) => {
      const validationErrors = validateQualityDocument(payload, t)
      if (validationErrors) {
        setErrors(validationErrors)
        return false
      }
      return true
    },
    [formData, t]
  )

  const saveDraft = useCallback(async () => {
    if (!isLockedByCurrentUser) return
    if (autosaveInFlightRef.current) return

    autosaveInFlightRef.current = true

    try {
      const payload = formatPayload(latestFormDataRef.current)
      const documentExistsForYear = await hasExistingDocumentForSelectedYear()

      if (!documentExistsForYear) {
        const createdDocument = await createDocument({
          studyprogrammeKey: programmeKey,
          data: payload as any,
          year: selectedYear,
        }).unwrap()

        navigate(`/v1/programmes/10/${programmeKey}/qualitydocument/${createdDocument.id}`)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to auto-save quality draft:', error)
    } finally {
      autosaveInFlightRef.current = false
    }
  }, [
    isLockedByCurrentUser,
    createDocument,
    formatPayload,
    hasExistingDocumentForSelectedYear,
    navigate,
    programmeKey,
    selectedYear,
  ])

  useEffect(() => {
    let intervalId: number | null = null

    if (isLockedByCurrentUser) {
      intervalId = window.setInterval(() => {
        void saveDraft()
      }, AUTOSAVE_INTERVAL_MS)
    }

    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId)
      }
    }
  }, [isLockedByCurrentUser, saveDraft, AUTOSAVE_INTERVAL_MS])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!isLockedByCurrentUser) return

    const payload = formatPayload(formData)

    if (validateForm(payload)) {
      const currentId = id

      if (!currentId) {
        const documentExistsForYear = await hasExistingDocumentForSelectedYear()
        if (documentExistsForYear) {
          return
        }

        const createdDocument = await createDocument({
          studyprogrammeKey: programmeKey,
          data: payload as any,
          year: selectedYear,
        }).unwrap()

        setId(String(createdDocument.id))
      } else {
        await updateDocument({
          studyprogrammeKey: programmeKey,
          id: currentId,
          data: payload as any,
        })
      }

      handleReleaseLock()
      setFormData(initFormData(t))
      setErrors(initErrors())
      setFeedbackSourceOptions(defaultFeedbackSourceOptions)
      setSecondGuidanceExample(false)
      setThirdGuidanceExample(false)
      setSecondCurriculumExample(false)
      setThirdCurriculumExample(false)
      setSecondLearningExample(false)
      setThirdLearningExample(false)
      setId(null)

      navigate(`/v1/programmes/10/${programmeKey}`)
    }
  }

  if (isLoading) return <CircularProgress />

  if (!isLockedByCurrentUser || hasDocumentForYear) return null

  return (
    <Box ref={componentRef} sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ mb: '4rem' }} variant="h2">
        {t('qualitydocument:header')} - {`${new Date().toLocaleDateString('fi-FI')}`}
      </Typography>
      <QualityForm
        errors={errors}
        feedbackSourceOptions={feedbackSourceOptions}
        formData={formData}
        handleSubmit={handleSubmit}
        secondCurriculumExample={secondCurriculumExample}
        secondGuidanceExample={secondGuidanceExample}
        secondLearningExample={secondLearningExample}
        setFeedbackSourceOptions={setFeedbackSourceOptions}
        setFormData={setFormData}
        setSecondCurriculumExample={setSecondCurriculumExample}
        setSecondGuidanceExample={setSecondGuidanceExample}
        setSecondLearningExample={setSecondLearningExample}
        setThirdCurriculumExample={setThirdCurriculumExample}
        setThirdGuidanceExample={setThirdGuidanceExample}
        setThirdLearningExample={setThirdLearningExample}
        thirdCurriculumExample={thirdCurriculumExample}
        thirdGuidanceExample={thirdGuidanceExample}
        thirdLearningExample={thirdLearningExample}
      />
    </Box>
  )
}

export default AddQualityDocument
