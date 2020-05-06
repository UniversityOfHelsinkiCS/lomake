const db = require('@models/index')
const logger = require('@util/logger')

const createCypressUser = async () => {
  try {
    logger.info('Creating cypressUser for tests')

    await db.user.destroy({ where: { uid: 'cypressUser' } }) //Delete old one if exists

    await db.user.create({
      uid: 'cypressUser',
      name: 'cypressUser',
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
  } catch (error) {
    logger.error(`Failed to create cypressUser: ${error}`)
  }
}
module.exports = {
  createCypressUser,
}
