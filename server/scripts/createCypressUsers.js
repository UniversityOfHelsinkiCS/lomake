const db = require('@models/index')
const logger = require('@util/logger')
const { cypressUsers } = require('@util/common')

const createCypressUsers = async () => {
  try {
    logger.info('Creating users for Cypress tests')

    for (const user of cypressUsers) {
      await db.user.destroy({ where: { uid: user.uid } })
      await db.user.create(user)
    }
  } catch (error) {
    logger.error(`Failed to create users for Cypress tests: ${error}`)
  }
}
module.exports = {
  createCypressUsers,
}
