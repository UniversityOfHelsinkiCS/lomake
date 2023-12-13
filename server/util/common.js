const { Op } = require('sequelize')
const db = require('@models/index')
const common = require('@root/config/common')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8001
const AUTOMATIC_IAM_PERMISSIONS_ENABLED = process.env.AUTOMATIC_IAM_PERMISSIONS_ENABLED === 'true'

const whereDraftYear = async () => {
  const draftYears = await db.draftYear.findAll({})
  const draftYear = draftYears.length ? draftYears[0].year : null
  return draftYear || { [Op.is]: null }
}

const getFormType = form => {
  if (form === 1) {
    return 'yearly'
  }
  if (form === 2) {
    return 'degree-reform'
  }
  if (form === 3) {
    return 'degree-reform-individual'
  }
  if (form === 4) {
    return 'evaluation'
  }
  if (form === 5) {
    return 'evaluation-faculty'
  }
  if (form === 6) {
    return 'evaluation-university'
  }
  return 'yearly'
}

module.exports = {
  ...common,
  DB_URL,
  PORT,
  AUTOMATIC_IAM_PERMISSIONS_ENABLED,
  whereDraftYear,
  getFormType,
}
