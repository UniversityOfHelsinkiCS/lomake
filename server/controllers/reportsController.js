const db = require('@models/index')
const { isAdmin, isSuperAdmin } = require('@util/common')
const logger = require('@util/logger')
const moment = require('moment')
const { getFormType } = require('@util/common')
const { seed } = require('../scripts/seed')

// TODO: VALIDATE BODY DATA

// Report ---------------------------------------------------------------
const createReport = async (req, res) => {
    try {
        const { studyprogrammeId, year } = req.body

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        // Check that report does not already exist for this studyprogramme and year
        const existingReport = await db.report.findOne({
            where: {
                studyprogrammeId,
                year
            }
        })
        if (existingReport) {
            return res.status(400).json({ error: 'Report already exists for this studyprogramme and year' })
        }

        const data = await db.report.create({
            studyprogrammeId,
            year
        })

        return res.status(201).json(data)
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const getReports = async (req, res) => {
    try {
        const { studyprogrammeId } = req.params

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const data = await db.report.findAll({
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

const getReport = async (req, res) => {
    try {
        const { studyprogrammeId, year } = req.params

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const data = await db.report.findOne({
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

const deleteReport = async (req, res) => {
    try {
        const { studyprogrammeId, year } = req.params

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const data = await db.report.destroy({
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
const getComments = async (req, res) => {
    try {
        const { studyprogrammeId, year } = req.params

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const report = await db.report.findOne({
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

const createOrUpdateComments = async (req, res) => {
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
        const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const report = await db.report.findOne({
            where: {
                studyprogrammeId,
                year
            }
        })

        if (!report) {
            return res.status(404).json({ error: 'No report was found' })
        }

        const data = await db.report.update({
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

const deleteComments = async (req, res) => {
    try {
        const { studyprogrammeId, year } = req.params

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const report = await db.report.findOne({
            where: {
                studyprogrammeId,
                year
            }
        })

        if (!report) {
            return res.status(404).json({ error: 'No report was found' })
        }

        await db.report.update({
            comments: null
        }, {
            where: {
                studyprogrammeId,
                year
            }
        })

        return res.status(200).json({ message: 'Comments deleted successfully' })

    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}


// Actions ---------------------------------------------------------------
const getActions = async (req, res) => {
    try {
        const { studyprogrammeId, year } = req.params

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const report = await db.report.findOne({
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

const createOrUpdateActions = async (req, res) => {
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
        const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const report = await db.report.findOne({
            where: {
                studyprogrammeId,
                year
            }
        })

        if (!report) {
            return res.status(404).json({ error: 'No report was found' })
        }

        const data = await db.report.update({
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

const deleteActions = async (req, res) => {
    try {
        const { studyprogrammeId, year } = req.params

        if (!studyprogrammeId) {
            return res.status(400).json({ error: 'Studyprogramme is required' })
        }

        if (!year) {
            return res.status(400).json({ error: 'Year is required' })
        }

        // Check that studyprogramme exists
        const studyprogramme = await db.studyprogramme.findByPk(studyprogrammeId)
        if (!studyprogramme) {
            return res.status(404).json({ error: 'Studyprogramme not found' })
        }

        const report = await db.report.findOne({
            where: {
                studyprogrammeId,
                year
            }
        })

        if (!report) {
            return res.status(404).json({ error: 'No report was found' })
        }

        await db.report.update({
            actions: null
        }, {
            where: {
                studyprogrammeId,
                year
            }
        })

        return res.status(200).json({ message: 'Comments deleted successfully' })

    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

module.exports = {
    createReport,
    getReports,
    getReport,
    deleteReport,
    getComments,
    createOrUpdateComments,
    deleteComments,
    getActions,
    createOrUpdateActions,
    deleteActions
}