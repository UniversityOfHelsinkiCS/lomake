const { Op } = require('sequelize')
const db = require('@models/index')
const common = require('@root/config/common')
const { formKeys } = require('@root/config/data')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8001
const AUTOMATIC_IAM_PERMISSIONS_ENABLED = process.env.AUTOMATIC_IAM_PERMISSIONS_ENABLED === 'true'

const whereDraftYear = async () => {
  const draftYears = await db.draftYear.findAll({})
  const draftYear = draftYears.length ? draftYears[0].year : new Date().getFullYear()
  return draftYear || { [Op.is]: null }
}

const getFormType = form => {
  if (form === formKeys.YEARLY_ASSESSMENT) {
    return 'yearly'
  }
  if (form === formKeys.DEGREE_REFORM_PROGRAMMES) {
    return 'degree-reform'
  }
  if (form === formKeys.DEGREE_REFORM_INDIVIDUALS) {
    return 'degree-reform-individual'
  }
  if (form === formKeys.EVALUATION_PROGRAMMES) {
    return 'evaluation'
  }
  if (form === formKeys.EVALUATION_FACULTIES) {
    return 'evaluation-faculty'
  }
  if (form === formKeys.EVALUATION_COMMTTEES) {
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
