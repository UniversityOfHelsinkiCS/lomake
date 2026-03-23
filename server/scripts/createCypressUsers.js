import logger from '../util/logger.js'
import { cypressUsers } from '../../config/common.js'
import User from '../models/user.js'

const createCypressUsers = () => {
  try {
    logger.info('Creating users for Cypress tests')

    cypressUsers.forEach(async user => {
      await User.destroy({ where: { uid: user.uid } })
      await User.create(user)
    })
  } catch (error) {
    logger.error(`Failed to create users for Cypress tests: ${error.error}`)
  }
}

export default {
  createCypressUsers,
}
