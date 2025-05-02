import logger from '../util/logger.js'
import db from '../models/index.js'
import Document from '../models/document.js'
import { Op } from 'sequelize'

import type { Request, Response } from 'express'

type DocumentData = any

interface ValidateOperationResponse {
  success: boolean
  error: string
  status: number
  document: Document | null
  studyprogrammeId: number | null
  data: DocumentData
}

interface DocumentResponse {
  error?: string
  data?: DocumentData
  success?: boolean
  statusCode?: number
}

const validateOperation = async (req: Request): Promise<ValidateOperationResponse> => {
  const { studyprogrammeKey, year } = req.params
  const data = req.body

  const resultObject: ValidateOperationResponse = {
    success: false,
    error: '',
    status: 0,
    document: null,
    studyprogrammeId: null,
    data: {},
  }

  if (!studyprogrammeKey) {
    resultObject.error = 'StudyprogrammeKey param is required'
    resultObject.status = 400
    return resultObject
  }

  // @ts-ignore
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

  const document: Document = await Document.findAll({
    where: {
      studyprogrammeId: studyprogramme.id,
    },
  })

  if (!document) {
    resultObject.error = 'No report for that year was found'
    resultObject.status = 404
    return resultObject
  }

  if (!data) {
    resultObject.error = 'Data is required'
    resultObject.status = 400
    return resultObject
  }

  //TODO: validate keys here

  resultObject.success = true
  resultObject.document = document
  resultObject.studyprogrammeId = parseInt(studyprogramme.id)
  resultObject.status = 200
  resultObject.data = data

  return resultObject
}

const getDocuments = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({})
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

export default { getDocuments }
