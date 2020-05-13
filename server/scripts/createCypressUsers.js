const db = require('@models/index')
const logger = require('@util/logger')

const createCypressUsers = async () => {
  try {
    logger.info('Creating users for Cypress tests')

    await db.user.destroy({ where: { uid: 'cypressUser' } })
    await db.user.destroy({ where: { uid: 'cypressAdminUser' } })

    await db.user.create({
      uid: 'cypressUser',
      firstname: 'cyp',
      lastname: 'res',
      email: 'cypressUser',
      admin: false,
      access: {
        KH80_001: {
          read: true,
          admin: true,
          write: true,
        },
        KH50_004: {
          read: true,
        },
        KH50_005: {
          write: true,
          read: true,
        },
      },
      irrelevant: false,
    })

    await db.user.create({
      uid: 'cypressAdminUser',
      firstname: 'cypress',
      lastname: 'admin',
      email: 'cypressAdminUser',
      admin: true,
      irrelevant: false,
    })
  } catch (error) {
    logger.error(`Failed to create users for Cypress tests: ${error}`)
  }
}
module.exports = {
  createCypressUsers,
}
