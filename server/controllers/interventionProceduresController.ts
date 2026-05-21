import logger from '../util/logger.js'
import InterventionProcedure from '../models/interventionProcedure.js'
import { Request, Response } from 'express'
import Studyprogramme from '../models/studyprogramme.js'
import { ErrorObject } from '@/shared/lib/types.js'

interface ValidateOperationResponse {
  success: boolean
  error: string
  status: number
  interventionProcedures: InterventionProcedure[] | []
  programme: string | null
}

const validateOperation = async (req: Request): Promise<ValidateOperationResponse> => {
  const { programme } = req.params

  const resultObject: ValidateOperationResponse = {
    success: false,
    error: '',
    status: 0,
    interventionProcedures: [],
    programme: null,
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

  let interventionProcedures: InterventionProcedure[] = []

  interventionProcedures = await InterventionProcedure.findAll({
    where: {
      studyprogrammeKey: studyprogramme.key,
    },
    attributes: ['id', 'studyprogrammeKey', 'active', 'startYear', 'endYear'],
    order: [['createdAt', 'ASC']],
  })

  resultObject.success = true
  resultObject.interventionProcedures = interventionProcedures
  resultObject.programme = studyprogramme.key
  resultObject.status = 200

  return resultObject
}

const getProgrammesInterventionProcedures = async (req: Request, res: Response) => {
  try {
    const result = await validateOperation(req)
    if (!result.success) return res.status(result.status).json({ error: result.error })
    return res.status(200).json(result.interventionProcedures)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getInterventionProcedures = async (req: Request, res: Response) => {
  try {
    const interventionProcedures = await InterventionProcedure.findAll({})

    return res.status(200).json(interventionProcedures)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

type CreateInterventionProcedureResponse = {
  id: number
  active: boolean
  startYear: number
  endYear: number | null
  studyprogrammeKey: string
  reason: object | null
  createdAt: Date
  updatedAt: Date
}

const createInterventionProcedure = async (
  req: Request,
  res: Response<CreateInterventionProcedureResponse | ErrorObject>
) => {
  try {
    const { studyprogrammeKey, year } = req.body

    if (!studyprogrammeKey || !year) {
      return res.status(400).json({ error: 'studyprogrammeKey and year are required' })
    }

    const existing = await InterventionProcedure.findOne({
      where: { studyprogrammeKey, active: true },
    })

    if (existing) {
      return res.status(409).json({ error: 'Active intervention procedure for this studyprogramme already exists' })
    }

    const newInterventionProcedure = await InterventionProcedure.create({
      studyprogrammeKey,
      startYear: year,
      active: true,
    })

    return res.status(201).json(newInterventionProcedure)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const updateInterventionProcedure = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { startYear } = req.body

    if (!id || startYear === undefined) {
      return res.status(400).json({ error: 'id and startYear are required' })
    }

    const interventionProcedure = await InterventionProcedure.findByPk(Number(id))
    if (!interventionProcedure) {
      return res.status(404).json({ error: 'Intervention procedure not found' })
    }

    interventionProcedure.startYear = Number(startYear)
    await interventionProcedure.save()

    return res.status(200).json(interventionProcedure)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

export default {
  getProgrammesInterventionProcedures,
  getInterventionProcedures,
  createInterventionProcedure,
  updateInterventionProcedure,
}
