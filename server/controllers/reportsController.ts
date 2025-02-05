import logger from '../util/logger.js'
import db from '../models/index.js'

import Report from '../models/reports.js'
import { Op } from 'sequelize'
import { updateWebsocketState } from '../websocket.js'

import type { Request, Response } from 'express'

interface ValidateOperationResponse {
  success: boolean,
  error: string,
  status: number,
  report: Report | null,
  studyprogrammeId: number | null,
  year: number | null
}

const validateOperation = async (req: Request): Promise<ValidateOperationResponse> => {
  const { studyprogrammeKey, year } = req.params

  // TODO: validate body data

  const resultObject: ValidateOperationResponse = {
    success: false,
    error: "",
    status: 0,
    report: null,
    studyprogrammeId: null,
    year: null
  }

  if (!studyprogrammeKey) {
    resultObject.error = 'StudyprogrammeKey param is required'
    resultObject.status = 400
    return resultObject
  }

  if (!year) {
    resultObject.error = 'Year param is required'
    resultObject.status = 400
    return resultObject
  }

  // @ts-ignore
  // ignore db type error for now since it has not been typed
  const studyprogramme = await db.studyprogramme.findOne({
    where: {
      key: studyprogrammeKey
    }
  })
  if (!studyprogramme) {
    resultObject.error = 'Studyprogramme not found'
    resultObject.status = 404
    return resultObject
  }

  const report: Report = await Report.findOne({
    where: {
      studyprogrammeId: studyprogramme.id,
      year
    }
  })
  if (!report) {
    resultObject.error = 'No report for that year was found'
    resultObject.status = 404
    return resultObject
  }

  resultObject.success = true
  resultObject.report = report
  resultObject.studyprogrammeId = parseInt(studyprogramme.id)
  resultObject.year = parseInt(year)
  resultObject.status = 200

  return resultObject
}

const getReports = async (req: Request, res: Response) => {
  try {
    const { studyprogrammeId } = req.params

    if (!studyprogrammeId) {
      return res.status(400).json({ error: 'Studyprogramme is required' })
    }

    // Check that studyprogramme exists
    // @ts-ignore
    // ignore db type error for now since it has not been typed
    const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
    if (!studyprogramme) {
      return res.status(404).json({ error: 'Studyprogramme not found' })
    }

    const reports: Report[] = await Report.findAll({
      where: {
        studyprogrammeId,
      }
    })

    return res.status(200).json(reports)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getReport = async (req: Request, res: Response) => {
  try {
    const result = await validateOperation(req)
    if (!result.success) return res.status(result.status).json({ error: result.error })

    const { report } = result

    return res.status(200).json(report)

  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const updateReport = async (req: Request, res: Response) => {
  try {
    const result = await validateOperation(req)
    if (!result.success) return res.status(result.status).json({ error: result.error })

    let data = req.body
    const { report, studyprogrammeId, year } = result

    const [_, updatedReport] = await Report.update(
      { data: { ...report.data, ...data } },
      {
        where: {
          [Op.and]: [
            { studyprogrammeId },
            { year }
          ]
        },
        returning: true
      }
    )

    data = updatedReport[0].data

    // @ts-ignore
    updateWebsocketState(req.user, { room: req.params.studyprogrammeKey, data })

    return res.status(200).json(updatedReport)
  } catch (error) {
    logger.error(`Database error ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const deleteReport = async (req: Request, res: Response) => {
  try {
    const result = await validateOperation(req)
    if (!result.success) return res.status(result.status).json({ error: result.error })

    const { studyprogrammeId, year } = result

    const data = await Report.destroy({
      where: {
        [Op.and]: [
          { studyprogrammeId },
          { year }
        ]
      }
    })

    if (!data) {
      return res.status(404).json({ error: 'No report was found' })
    }

    return res.status(200).json({ message: 'Report deleted successfully' })

  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

export default { getReports, getReport, updateReport, deleteReport }

