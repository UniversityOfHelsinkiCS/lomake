import logger from '../util/logger.js'
import Document from '../models/document.js'
import { Request, Response } from 'express'
import { DocumentFormSchema, InterventionProcedureCloseSchema } from '../../shared/validators/index.js'
import { sequelize } from '../database/connection.js'
import Studyprogramme from '../models/studyprogramme.js'

interface ValidateOperationResponse {
  success: boolean
  error: string
  status: number
  documents: Document[] | []
  programme: string | null
  data: typeof DocumentFormSchema | null
}

const validateOperation = async (req: Request): Promise<ValidateOperationResponse> => {
  const { programme, id } = req.params
  const { data } = req.body

  const resultObject: ValidateOperationResponse = {
    success: false,
    error: '',
    status: 0,
    documents: [],
    programme: null,
    data: null,
  }

  if (!programme) {
    resultObject.error = 'StudyprogrammeKey param is required'
    resultObject.status = 400
    return resultObject
  }

  const studyprogramme = await Studyprogramme.findOne({
    where: {
      key: programme,
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
  resultObject.programme = studyprogramme.key
  resultObject.status = 200
  resultObject.data = data

  return resultObject
}

const getDocuments = async (req: Request, res: Response) => {
  try {
    const result = await validateOperation(req)
    if (!result.success) return res.status(result.status).json({ error: result.error })
    return res.status(200).json(result.documents)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getAllDocuments = async (req: Request, res: Response) => {
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

const createDocument = async (req: Request, res: Response) => {
  try {
    const { programme, status, error, documents } = await validateOperation(req)
    if (!programme) return res.status(status).json({ error: error })

    const calculateActiveYear = () => {
      const last = documents.length > 0 ? documents.length - 1 : 0
      if (documents.length === 0 || documents?.[last].active === false) return new Date().getFullYear()
      return documents[last].activeYear
    }

    const document: Document = await Document.create({
      data: { title: `${new Date().toLocaleDateString('fi-FI')}` },
      studyprogrammeKey: programme,
      active: true,
      activeYear: calculateActiveYear(),
    })

    res.status(201).json([...documents, document])
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const updateDocument = async (req: Request, res: Response) => {
  try {
    const { documents, data, status, error } = await validateOperation(req)
    if (documents.length === 0) return res.status(status).json({ error: error })

    const document: Document = documents.pop()
    document.data = data
    const updated: Document = await document.save()

    return res.status(204).json({ documents: [...documents, updated] })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const closeInterventionProcedure = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction()

  try {
    const { programme, documents, status, error, data } = await validateOperation(req)
    if (documents.length === 0) return res.status(status).json({ error: error })

    const updates = {
      active: false,
      reason: data,
    }

    await Document.update(updates, {
      where: {
        studyprogrammeKey: programme,
        active: true,
      },
      transaction,
    })

    await transaction.commit()

    return res.status(204).json({ documents: [] })
  } catch (error) {
    await transaction.rollback()
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}
// Only admins allowed, checked in routes file
const deleteDocument = async (req: Request, res: Response) => {
  const { id, programme } = req.params

  try {
    await Document.destroy({
      where: {
        id,
        studyprogrammeKey: programme,
      },
    })

    return res.status(204).send()
  } catch (error) {
    logger.error(`Database error: ${error}`)
    console.log()
    return res.status(500).json({ error: 'Database error' })
  }
}

export default { getDocuments, createDocument, updateDocument, closeInterventionProcedure, getAllDocuments, deleteDocument }
