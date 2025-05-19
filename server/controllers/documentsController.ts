import logger from '../util/logger.js'
import db from '../models/index.js'
import Document from '../models/document.js'
import type { Request, Response } from 'express'
import { DocumentFormSchema, InterventionProcedureCloseSchema } from '../../shared/validators/index.js'
import { sequelize } from '../database/connection.js'
import { get } from 'lodash'

interface ValidateOperationResponse {
  success: boolean
  error: string
  status: number
  documents: Document[] | []
  studyprogrammeKey: string | null
  data: typeof DocumentFormSchema | null
}

const validateOperation = async (req: Request): Promise<ValidateOperationResponse> => {
  const { studyprogrammeKey, id } = req.params
  const { data } = req.body

  const resultObject: ValidateOperationResponse = {
    success: false,
    error: '',
    status: 0,
    documents: [],
    studyprogrammeKey: null,
    data: null,
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
    const validationResult1 = DocumentFormSchema.safeParse(data)
    const validationResult2 = InterventionProcedureCloseSchema.safeParse(data)

    if (!validationResult1.success && !validationResult2.success) {
      const errors1 = validationResult1.success ? [] : validationResult1.error.errors.map(e => e.message)
      const errors2 = validationResult2.success ? [] : validationResult2.error.errors.map(e => e.message)

      const allErrors = [...errors1, ...errors2]

      resultObject.error = allErrors.join(', ')
      resultObject.status = 400
      return resultObject
    }
  }

  let documents: Document[] = []

  if (id) {
    documents = await Document.findAll({
      where: {
        id,
        studyprogrammeKey: studyprogramme.key,
      },
    })
  } else {
    documents = await Document.findAll({
      where: {
        studyprogrammeKey: studyprogramme.key,
      },
      attributes: ['id', 'data', 'studyprogrammeKey', 'active', 'activeYear', 'reason'],
      order: [['createdAt', 'ASC']],
    })
  }

  resultObject.success = true
  resultObject.documents = documents
  resultObject.studyprogrammeKey = studyprogramme.key
  resultObject.status = 200
  resultObject.data = data

  return resultObject
}

const getDocuments = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await validateOperation(req)
    if (!result.success) return res.status(result.status).json({ error: result.error })
    return res.status(200).json(result.documents)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getAllDocuments = async (req: Request, res: Response): Promise<any> => {
  try {
    const { activeYear } = req.params

    if (!activeYear) {
      return res.status(400).json({ error: 'Active year param is required' })
    }

    const documents = await Document.findAll({
      where: { activeYear },
    })

    return res.status(200).json(documents)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const createDocument = async (req: Request, res: Response): Promise<any> => {
  try {
    const { studyprogrammeKey, status, error, documents } = await validateOperation(req)
    if (!studyprogrammeKey) return res.status(status).json({ error: error })

    const calculateActiveYear = () => {
      const last = documents.length > 0 ? documents.length - 1 : 0
      if (documents.length === 0 || documents?.[last].active === false) return new Date().getFullYear()
      return documents[last].activeYear
    }

    const document: Document = await Document.create({
      data: { title: `${new Date().toLocaleDateString('fi-FI')}` },
      studyprogrammeKey,
      active: true,
      activeYear: calculateActiveYear(),
    })

    // @ts-expect-error
    documents.push(document)

    res.status(201).json(documents)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const updateDocument = async (req: Request, res: Response): Promise<any> => {
  try {
    const { documents, data, status, error } = await validateOperation(req)
    if (documents.length === 0) return res.status(status).json({ error: error })

    const document: Document = documents.pop()
    const updated: Document = await document.update({
      data,
    })

    return res.status(204).json(updated)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const closeInterventionProcedure = async (req: Request, res: Response): Promise<any> => {
  const transaction = await sequelize.transaction()

  try {
    const { studyprogrammeKey, documents, status, error, data } = await validateOperation(req)
    if (documents.length === 0) return res.status(status).json(error)

    const updates = {
      active: false,
      reason: data,
    }

    await Document.update(updates, {
      where: {
        studyprogrammeKey: studyprogrammeKey,
        active: true,
      },
      transaction,
    })

    await transaction.commit()

    return res.status(204).json({})
  } catch (error) {
    await transaction.rollback()
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

export default { getDocuments, createDocument, updateDocument, closeInterventionProcedure, getAllDocuments }
