import logger from '../util/logger.js'
import db from '../models/index.js'

// Models
import Report from '../models/reports.js'

// Types
import type { Request, Response } from 'express'

interface ValidateOperationResponse {
    success: boolean,
    error: string,
    status: number,
    report: Report | null,
    studyprogrammeId: number | null,
    year: number | null
}

// Helper functions ---------------------------------------------------------------
const validateOperation = async (req: Request): Promise<ValidateOperationResponse> => {
    const { studyprogrammeId, year } = req.params

    // TODO: validate body data

    const resultObject: ValidateOperationResponse = {
        success: false,
        error: "",
        status: 0,
        report: null,
        studyprogrammeId: null,
        year: null
    }

    if (!studyprogrammeId) {
        resultObject.error = 'StudyprogrammeId param is required'
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
    const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
    if (!studyprogramme) {
        resultObject.error = 'Studyprogramme not found'
        resultObject.status = 404
        return resultObject
    }

    const report: Report = await Report.findOne({
        where: {
            studyprogrammeId,
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
    resultObject.studyprogrammeId = parseInt(studyprogrammeId)
    resultObject.year = parseInt(year)
    resultObject.status = 200

    return resultObject
}


// Report ---------------------------------------------------------------
const createReport = async (req: Request, res: Response) => {

    try {
        const result = await validateOperation(req)
        if (!result.success) return res.status(result.status).json({ error: result.error })

        const { studyprogrammeId, year } = result

        const report: Report = await Report.create({
            studyprogrammeId,
            year
        })

        return res.status(201).json(report)
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
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

const deleteReport = async (req: Request, res: Response) => {
    try {
        const result = await validateOperation(req)
        if (!result.success) return res.status(result.status).json({ error: result.error })

        const { studyprogrammeId, year } = result

        const data = await Report.destroy({
            where: {
                studyprogrammeId,
                year
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



// Comments ---------------------------------------------------------------
const getComments = async (req: Request, res: Response) => {
    try {
        const result = await validateOperation(req)
        if (!result.success) return res.status(result.status).json({ error: result.error })

        const { report } = result

        const data = report.comments

        return res.status(201).json(data)

    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const updateComments = async (req: Request, res: Response) => {
    try {
        const result = await validateOperation(req)
        if (!result.success) return res.status(result.status).json({ error: result.error })

        const { studyprogrammeId, year } = result
        const comments = req.body

        const data = await Report.update({
            comments,
        }, {
            where: {
                studyprogrammeId,
                year
            }
        })

        return res.status(200).json(data)
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}


// Studyprogramme Measures ---------------------------------------------------------------
const getStudyprogrammeMeasures = async (req: Request, res: Response) => {
    try {
        const result = await validateOperation(req)
        if (!result.success) return res.status(result.status).json({ error: result.error })

        const { report } = result

        const data = report.studyprogrammeMeasures

        return res.status(200).json(data)

    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const updateStudyprogrammeMeasures = async (req: Request, res: Response) => {
    try {
        const result = await validateOperation(req)
        if (!result.success) return res.status(result.status).json({ error: result.error })

        const { studyprogrammeId, year } = result
        const studyprogrammeMeasures = req.body
        
        const data = await Report.update({
            studyprogrammeMeasures,
        }, {
            where: {
                studyprogrammeId,
                year
            }
        })

        return res.status(200).json(data)
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}


// Faculty Actions ---------------------------------------------------------------
const getFacultyMeasures = async (req: Request, res: Response) => {
    try {
        
        const result = await validateOperation(req)
        if (!result.success) return res.status(result.status).json({ error: result.error })

        const { report } = result

        const data = report.facultyMeasures

        return res.status(200).json(data)

    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}


const updateFacultyMeasures = async (req: Request, res: Response) => {
    try {
        const result = await validateOperation(req)
        if (!result.success) return res.status(result.status).json({ error: result.error })

        const { studyprogrammeId, year } = result
        const facultyMeasures = req.body

        const data = await Report.update({
            facultyMeasures,
        }, {
            where: {
                studyprogrammeId,
                year
            }
        })

        return res.status(200).json(data)
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}



export default {
    createReport,
    getReports,
    getReport,
    deleteReport,
    
    getComments,
    updateComments,
    
    getStudyprogrammeMeasures,
    updateStudyprogrammeMeasures,

    getFacultyMeasures,
    updateFacultyMeasures
}