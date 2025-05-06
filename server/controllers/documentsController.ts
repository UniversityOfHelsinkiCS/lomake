import logger from '../util/logger.js'
import db from '../models/index.js'
import Document from '../models/document.js'

import type { Request, Response } from 'express'
import { DocumentFormSchema } from '../../shared/validators/index.js'

type DocumentData = any

interface ValidateOperationResponse {
  success: boolean
  error: string
  status: number
  documents: Document[] | null
  studyprogrammeKey: string | null
  data: DocumentData
}

interface DocumentResponse {
  error?: string
  data?: DocumentData
  success?: boolean
  statusCode?: number
}

const validateOperation = async (req: Request): Promise<ValidateOperationResponse> => {
  const { studyprogrammeKey } = req.params
  const { data } = req.body

  const resultObject: ValidateOperationResponse = {
    success: false,
    error: '',
    status: 0,
    documents: [],
    studyprogrammeKey: null,
    data: {},
  }

  if (!studyprogrammeKey) {
    resultObject.error = 'StudyprogrammeKey param is required'
    resultObject.status = 400
    return resultObject
  }

  // @ts-expect-error
  // ignore db type error for now since it has not been typed
  const studyprogramme = await db.studyprogramme.findOne({
    where: {
      key: studyprogrammeKey,
    },
  })

  if (!studyprogramme) {
    resultObject.error = 'Studyprogramme not found'
    resultObject.status = 404
    return resultObject
  }

  if (data) {
    const validationResult = DocumentFormSchema.safeParse(data)
    if (!validationResult.success) {
      resultObject.error = validationResult.error.errors.map(e => e.message).join(', ')
      resultObject.status = 400
      return resultObject
    }
  }

  const documents: Document[] = await Document.findAll({
    where: {
      studyprogrammeKey: studyprogramme.key,
    },
    attributes: ['id', 'data', 'studyprogrammeKey']
  })

  if (documents.length === 0) {
    resultObject.error = 'No documents found for studyprogramme'
    resultObject.status = 404
    resultObject.studyprogrammeKey = studyprogramme.key
    return resultObject
  }

  resultObject.success = true
  resultObject.documents = documents
  resultObject.studyprogrammeKey = studyprogramme.key
  resultObject.status = 200
  resultObject.data = data

  return resultObject
}

const getDocuments = async (req: Request, res: Response): Promise<DocumentResponse> => {
  try {
    const result = await validateOperation(req)
    if (!result.success) return res.status(result.status).json({ error: result.error })
    return res.status(200).json(result.documents)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const createDocument = async (req: Request, res: Response): Promise<DocumentResponse> => {
  try {
    const { studyprogrammeKey, status, error, data } = await validateOperation(req)
    if (!studyprogrammeKey) return res.status(status).json({ error: error })

    const document = await Document.create({
      data,
      studyprogrammeKey
    })

    res.status(201).json(document)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

export default { getDocuments, createDocument }
