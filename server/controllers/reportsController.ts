import logger from '../util/logger.js'
import db from '../models/index.js'

import Report from '../models/reports.js'
import { Op } from 'sequelize'
import { updateWSAndClearEditors } from '../websocket.js'

import type { Request, Response } from 'express'
import type { ReportData } from '@/shared/lib/types.js'
interface ValidateOperationResponse {
  success: boolean
  error: string
  status: number
  report: Report | null
  studyprogrammeId: number | null
  year: number | null
  data: ReportData
}
interface ReportResponse {
  error?: string
  data?: ReportData
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
    report: null,
    studyprogrammeId: null,
    year: null,
    data: {},
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
      key: studyprogrammeKey,
    },
  })
  if (!studyprogramme) {
    resultObject.error = 'Studyprogramme not found'
    resultObject.status = 404
    return resultObject
  }

  const report: Report = await Report.findOne({
    where: {
      studyprogrammeId: studyprogramme.id,
      year,
    },
  })
  if (!report) {
    resultObject.error = 'No report for that year was found'
    resultObject.status = 404
    return resultObject
  }

  if (!data) {
    resultObject.error = 'Data is required'
    resultObject.status = 400
    return resultObject
  }

  const allowedKeys: (keyof ReportData)[] = [
    'Vetovoimaisuus',
    'Opintojen sujuvuus ja valmistuminen',
    'Palaute ja työllistyminen',
    'Resurssien käyttö',
    'Toimenpiteet',
  ]

  const invalidKeys = Object.keys(data).filter(key => !allowedKeys.includes(key as keyof ReportData))
  if (invalidKeys.length > 0) {
    resultObject.error = `Invalid field(s): ${invalidKeys.join(', ')}`
    resultObject.status = 400
    return resultObject
  }

  resultObject.success = true
  resultObject.report = report
  resultObject.studyprogrammeId = parseInt(studyprogramme.id)
  resultObject.year = parseInt(year)
  resultObject.status = 200
  resultObject.data = data

  return resultObject
}

const getReports = async (req: Request, res: Response): Promise<ReportResponse> => {
  try {
    const { studyprogrammeKey } = req.params

    const reports = await Report.findAll({
      where: {
        studyprogrammeKey,
      },
    })

    return res.status(200).json(reports)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getReport = async (req: Request, res: Response): Promise<ReportResponse> => {
  try {
    const result = await validateOperation(req)

    if (!result.success) return res.status(result.status).json({ error: result.error })

    return res.status(200).json(result.report.data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const updateReport = async (req: Request, res: Response): Promise<ReportResponse> => {
  try {
    const result = await validateOperation(req)
    if (!result.success) return res.status(result.status).json({ error: result.error })

    const { report, studyprogrammeId, year, data } = result

    const [_, updatedReport] = await Report.update(
      { data: { ...report.data, ...data } },
      {
        where: {
          [Op.and]: [{ studyprogrammeId }, { year }],
        },
        returning: true,
      },
    )

    const updatedData = updatedReport[0].data
    const field = Object.keys(data)[0]

    updateWSAndClearEditors({ room: req.params.studyprogrammeKey, data: updatedData, field })
    return res.status(200).json(updatedData)
  } catch (error) {
    logger.error(`Database error ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

export default { getReports, getReport, updateReport }
