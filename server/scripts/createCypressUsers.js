import db from '../models/index.js'
import logger from '../util/logger.js'
// eslint-disable-next-line
import { cypressUsers } from '../../config/common.js'

const createCypressUsers = async () => {
  try {
    logger.info('Creating users for Cypress tests')

    cypressUsers.forEach(async user => {
      await db.user.destroy({ where: { uid: user.uid } })
      await db.user.create(user)
    })
  } catch (error) {
    logger.error(`Failed to create users for Cypress tests: ${error}`)
  }
}

export default {
  createCypressUsers,
}
