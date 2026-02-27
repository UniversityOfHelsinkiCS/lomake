import logger from '../util/logger.js'
import QualityDocument from '../models/qualityDocument.js'
import { Request, Response } from 'express'
import { QualityDocumentFormSchema } from '../../shared/validators/index.js'
import Studyprogramme from '../models/studyprogramme.js'
import { ErrorObject } from '@/shared/lib/types.js'

interface ValidateOperationResponse {
  success: boolean
  error: string
  status: number
  qualityDocuments: QualityDocument[] | []
  programme: string | null
  data: typeof QualityDocumentFormSchema | null
}

const validationOperation = async (req: Request): Promise<ValidateOperationResponse> => {
  const {programme, id } = req.params
  const { data } = req.body

  const resultData: ValidateOperationResponse = {
    success: false,
    error: '',
    status: 0,
    qualityDocuments: [],
    programme: null,
    data: null,
  }

  if (!programme) {
    resultData.error = 'StudyprogrammeKey param is required.'
    resultData.status = 400
    return resultData
  }

  const studyProgramme = await Studyprogramme.findOne({
    where: {
      key: programme,
    },
    attributes: ['id', 'key'],
  })

  if (!studyProgramme) {
    resultData.error = 'StudyProgramme not found.'
    resultData.status = 404
    return resultData
  }

  if (data) {
    const validationResult = QualityDocumentFormSchema.safeParse(data)

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message)
      resultData.error = errors.join(', ')
      resultData.status = 400
      return resultData
    }
  }
  let qualityDocuments: QualityDocument[] = []

  if (id) {
    qualityDocuments = await QualityDocument.findAll({
      where: {
        id,
        studyprogrammeKey: studyProgramme.key,
      },
      attributes: ['id', 'data', 'studyprogrammeKey'],
      order: [['createdAt', 'ASC']],
    }) 
  } else {
    qualityDocuments = await QualityDocument.findAll({
      where: {
        studyprogrammeKey: studyProgramme.key,
      },
      attributes: ['id', 'data', 'studyprogrammeKey'],
      order: [['createdAt', 'ASC']],
    })
  }

  resultData.success = true
  resultData.qualityDocuments = qualityDocuments
  resultData.programme = studyProgramme.key,
  resultData.status = 200
  resultData.data = data

  return resultData
}

const getQualityDocuments = async (req: Request, res: Response<QualityDocument[] | ErrorObject>) => {
  try {
    const result = await validationOperation(req)
    if (!result.success) return res.status(result.status).json({ error: result.error })
    return res.status(200).json(result.qualityDocuments)
  } catch (error) {
    logger.error(`Database error ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const createQualityDocument = async (req: Request, res: Response<QualityDocument[] | ErrorObject>) => {
  try {
    const { programme, status, error, qualityDocuments} = await validationOperation(req)
    if (!programme) return res.status(status).json({ error: error })

    const qualityDocument: QualityDocument = await QualityDocument.create({
      data: { title: `${new Date().toLocaleDateString('fi-FI')}` },
      studyprogrammeKey: programme,
    })

    res.status(201).json([ ...qualityDocuments, qualityDocument ])
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const updateQualityDocument = async (req: Request, res: Response<QualityDocument[] | ErrorObject>) => {
  try {
    const { qualityDocuments, data, status, error } = await validationOperation(req)
    if (qualityDocuments.length === 0) return res.status(status).json({ error: error })

    let qualityDocument: QualityDocument = qualityDocuments.pop()
    qualityDocument.data = data

    const updated: QualityDocument = await qualityDocument.save()

    return res.status(204).json([...qualityDocuments, updated ])
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

// Only admins allowed, checked in routes file
const deleteQualityDocument = async (req: Request, res: Response) => {
  const { id, programme } = req.params

  try {
    // Allow deletion only for empty documents.
    const docToBeDestroyed = await QualityDocument.findByPk(id)
    if (!docToBeDestroyed?.data?.feedbackActions) {
      await QualityDocument.destroy({
        where: {
          id,
          studyprogrammeKey: programme,
        },
      })

      return res.status(204).send()
    } 
    return res.status(405).send({ error: 'Document not empty.' })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}


export default { getQualityDocuments, createQualityDocument, updateQualityDocument, deleteQualityDocument }
