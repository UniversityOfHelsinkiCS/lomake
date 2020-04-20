const db = require('@models/index')
const logger = require('@util/logger')

const createCypressUser = async () => {
  try {
    logger.info('Creating cypressUser for tests')
    await db.user.findOrCreate({
      where: {
        uid: 'cypressUser',
      },
      defaults: {
        name: 'cypressUser',
        email: 'cypressUser',
        admin: false,
        access: {
          bsc_computer_science: {
            read: true,
            admin: true,
            write: true,
          },
        },
        irrelevant: false,
      },
    })
  } catch (error) {
    logger.error(`Failed to create cypressUser: ${error}`)
  }
}
module.exports = {
  createCypressUser,
}
