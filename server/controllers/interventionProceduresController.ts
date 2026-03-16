import logger from '../util/logger.js'
import InterventionProcedure from '../models/interventionProcedure.js'
import { Request, Response } from 'express'
import Studyprogramme from '../models/studyprogramme.js'
import { Op } from 'sequelize'


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

const getActiveInterventionProcedures = async (req: Request, res: Response) => {
  try {
    const interventionProcedures = await InterventionProcedure.findAll({})
    
    return res.status(200).json(interventionProcedures)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}




export default { getProgrammesInterventionProcedures, getActiveInterventionProcedures }
