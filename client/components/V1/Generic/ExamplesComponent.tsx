import { Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import FeedbackActionForm from './FeedbackActionComponent'
import { useState } from 'react'
import { FormDataState } from '@/shared/lib/types'

const Examples = ({
  errors,
  field,
  formData,
  handelChange,
  setFormData,
}: {
  errors: Record<string, string>
  field: string
  formData: FormDataState
  handelChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>
}) => {
  const { t } = useTranslation()

  const hasExample = (sourceData: Record<string, any>, fieldName: string, exampleNum: number): boolean => {
    return !!(
      sourceData?.[`${fieldName}NameExample${exampleNum}`] ||
      sourceData?.[`${fieldName}ChangesExample${exampleNum}`] ||
      sourceData?.[`${fieldName}FeedbackSourceExample${exampleNum}`] ||
      sourceData?.[`${fieldName}CommunicationExample${exampleNum}`]
    )
  }

  const [secondExample, setSecondExample] = useState(hasExample(formData, field, 2))
  const [thirdExample, setThirdExample] = useState(hasExample(formData, field, 3))

  const handleAddExampleClick = () => {
    if (!secondExample) {
      setSecondExample(true)
    } else if (!thirdExample) {
      setThirdExample(true)
    }
  }

  return (
    <>
      <Typography variant="light">{t(`qualitydocument:${field}Examples`)}</Typography>
      <FeedbackActionForm
        errors={errors}
        example="1"
        field={field}
        formData={formData}
        handleChange={handelChange}
        setExample={setSecondExample}
        setFormData={setFormData}
      />
      {secondExample ? (
        <FeedbackActionForm
          errors={errors}
          example="2"
          field={field}
          formData={formData}
          handleChange={handelChange}
          setExample={setSecondExample}
          setFormData={setFormData}
        />
      ) : null}

      {thirdExample ? (
        <FeedbackActionForm
          errors={errors}
          example="3"
          field={field}
          formData={formData}
          handleChange={handelChange}
          setExample={setThirdExample}
          setFormData={setFormData}
        />
      ) : null}
      {!thirdExample || !secondExample ? (
        <Button onClick={handleAddExampleClick} type="button" variant="outlined">
          {t('qualitydocument:addNewExample')}
        </Button>
      ) : null}
    </>
  )
}

export default Examples
