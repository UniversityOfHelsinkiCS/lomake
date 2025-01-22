import logger from '../util/logger.js'

// Models
import Report from '../models/reports.js'
import Studyprogramme from '../models/studyprogramme.js'

// Types
import type { Request, Response } from 'express'

// TODO: VALIDATE BODY DATA
// TODO: Type the promise returns


// Report ---------------------------------------------------------------
const createReport = async (req: Request, res: Response) => {

    try {
        const { studyprogrammeId, year } = req.body

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await Studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }
        

        // Check that report does not already exist for this studyprogramme and year
        const existingReport = await Report.findOne({
            where: {
                studyprogrammeId,
                year
            }
        })
        if (existingReport) {
            return res.status(400).json({ error: 'Report already exists for this studyprogramme and year' })
        }

        const data = await Report.create({
            studyprogrammeId,
            year
        })

        return res.status(201).json(data)
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
        const studyprogramme = await Studyprogramme.findByPk(studyprogrammeId)

        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const data = await Report.findAll({
            where: {
                studyprogrammeId,
            }
        })

        return res.status(200).json(data)
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const getReport = async (req: Request, res: Response) => {
    try {
        const { studyprogrammeId, year } = req.params

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await Studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const data = await Report.findOne({
            where: {
                studyprogrammeId,
                year
            }
        })

        if (!data) {
            return res.status(404).json({ error: 'No report was found' })
        }

        return res.status(200).json(data)

    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const deleteReport = async (req: Request, res: Response) => {
    try {
        const { studyprogrammeId, year } = req.params

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await Studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

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
        const { studyprogrammeId, year } = req.params

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await Studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const report = await Report.findOne({
            where: {
                studyprogrammeId,
                year
            }
        })

        if (!report) {
            return res.status(404).json({ error: 'No report was found' })
        }

        const data = report.comments

        return res.status(201).json(data)

    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const updateComments = async (req: Request, res: Response) => {
    try {
        const { studyprogrammeId, year } = req.params
        const comments = req.body

        // TODO: validate body data

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await Studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const report = await Report.findOne({
            where: {
                studyprogrammeId,
                year
            }
        })

        if (!report) {
            return res.status(404).json({ error: 'No report was found' })
        }

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


// Actions ---------------------------------------------------------------
const getActions = async (req: Request, res: Response) => {
    try {
        const { studyprogrammeId, year } = req.params

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await Studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const report = await Report.findOne({
            where: {
                studyprogrammeId,
                year
            }
        })

        if (!report) {
            return res.status(404).json({ error: 'No report was found' })
        }

        const data = report.actions

        return res.status(200).json(data)

    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const updateActions = async (req: Request, res: Response) => {
    try {
        const { studyprogrammeId, year } = req.params
        const actions = req.body

        // TODO: validate body data

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await Studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const report = await Report.findOne({
            where: {
                studyprogrammeId,
                year
            }
        })

        if (!report) {
            return res.status(404).json({ error: 'No report was found' })
        }

        const data = await Report.update({
            actions,
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
    getActions,
    updateActions,
}