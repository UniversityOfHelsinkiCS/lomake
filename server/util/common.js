const { Op } = require('sequelize')
const db = require('@models/index')
const common = require('@root/config/common')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8000
const AUTOMATIC_IAM_PERMISSIONS_ENABLED = process.env.AUTOMATIC_IAM_PERMISSIONS_ENABLED === 'true'
const IN_TEST = true // process.env.RUNNING_TESTS === 'true'

const whereDraftYear = async () => {
  const draftYears = await db.draftYear.findAll({})
  const draftYear = draftYears.length ? draftYears[0].year : null
  return draftYear || { [Op.is]: null }
}

module.exports = {
  ...common,
  DB_URL,
  PORT,
  AUTOMATIC_IAM_PERMISSIONS_ENABLED,
  IN_TEST,
  whereDraftYear,
}
