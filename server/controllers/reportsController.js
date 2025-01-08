const db = require('@models/index')
const { isAdmin, isSuperAdmin } = require('@util/common')
const logger = require('@util/logger')
const moment = require('moment')
const { getFormType } = require('@util/common')
const { seed } = require('../scripts/seed')

const create = async (req, res) => {
    try {
        const data = await db.comments.create({})
        return res.status(200).json(data)
    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const get = async (_, res) => {
    try {

    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}

const update = async (req, res) => {
    try {

    } catch (error) {
        logger.error(`Database error: ${error}`)
        return res.status(500).json({ error: 'Database error' })
    }
}


