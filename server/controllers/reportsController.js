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

const deleteReport = async (req, res) => {
    try {
        return res.status(200).json("Report deleted successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const createComments = async (req, res) => {
    try {
        return res.status(200).json("Comment created successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const getComments = async (req, res) => {
    try {
        return res.status(200).json("Comment fetched successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const updateComments = async (req, res) => {
    try {
        return res.status(200).json("Comment updated successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const deleteComments = async (req, res) => {
    try {
        return res.status(200).json("Comment deleted successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const createActions = async (req, res) => {
    try {
        return res.status(200).json("Actions created successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const getActions = async (req, res) => {
    try {
        return res.status(200).json("Actions fetched successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const updateActions = async (req, res) => {
    try {
        return res.status(200).json("Comment updated successfully")
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const deleteActions = async (req, res) => {
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
    deleteReport,
    createComments,
    getComments,
    updateComments,
    deleteComments,
    createActions,
    getActions,
    updateActions,
    deleteActions
}