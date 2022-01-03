const common = require('@root/config/common')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8000
const AUTOMATIC_IAM_PERMISSIONS_ENABLED = process.env.AUTOMATIC_IAM_PERMISSIONS_ENABLED === 'true'

module.exports = {
  ...common,
  DB_URL,
  PORT,
  AUTOMATIC_IAM_PERMISSIONS_ENABLED,
}
