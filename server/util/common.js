const { Op } = require('sequelize')
const db = require('@models/index')
const common = require('@root/config/common')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8000

const whereDraftYear = async () => {
  const draftYears = await db.draftYear.findAll({})
  const draftYear = draftYears.length ? draftYears[0].year : null
  return draftYear || { [Op.is]: null }
}

module.exports = {
  ...common,
  DB_URL,
  PORT,
  whereDraftYear,
}
