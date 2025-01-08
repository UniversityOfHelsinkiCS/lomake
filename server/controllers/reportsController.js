const db = require('@models/index')
const { isAdmin, isSuperAdmin } = require('@util/common')
const logger = require('@util/logger')
const moment = require('moment')
const { getFormType } = require('@util/common')
const { seed } = require('../scripts/seed')

const createReport = async (req, res) => {
    try {
        // const data = await db.report.create({})
        return res.status(200).json("Report created successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const getReport = async (req, res) => {
    try {
        return res.status(200).json("Report fetched successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const updateReport = async (req, res) => {
    try {
        return res.status(200).json("Report updated successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const createComment = async (req, res) => {
    try {
        return res.status(200).json("Comment created successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const getComment = async (req, res) => {
    try {
        return res.status(200).json("Comment fetched successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const updateComment = async (req, res) => {
    try {
        return res.status(200).json("Comment updated successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const deleteComment = async (req, res) => {
    try {
        return res.status(200).json("Comment deleted successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const deleteAllComments = async (req, res) => {
    try {
        return res.status(200).json("All comments deleted successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const createMeasures = async (req, res) => {
    try {
        return res.status(200).json("Measures created successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const getMeasures = async (req, res) => {
    try {
        return res.status(200).json("Measures fetched successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const updateMeasures = async (req, res) => {
    try {
        return res.status(200).json("Comment updated successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const deleteMeasures = async (req, res) => {
    try {
        return res.status(200).json("Comment deleted successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

module.exports = {
    createReport,
    getReport,
    updateReport,
    createComment,
    getComment,
    updateComment,
    deleteComment,
    deleteAllComments,
    createMeasures,
    getMeasures,
    updateMeasures,
    deleteMeasures
}