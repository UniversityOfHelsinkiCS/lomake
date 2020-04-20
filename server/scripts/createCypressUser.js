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
        bsc_computer_science: {
          read: true,
          admin: true,
          write: true,
        },
        bsc_teachers_of_mathematics_physics_and_chemistry: {
          read: true,
        },
        bsc_agricultural_sciences: {
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
