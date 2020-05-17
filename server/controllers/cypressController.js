const db = require('@models/index')
const logger = require('@util/logger')
const { cypressUsers } = require('@util/common')

const resetUsers = async (req, res) => {
  try {
    for (const user of cypressUsers) {
      await db.user.destroy({ where: { uid: user.uid } })
      await db.user.create(user)
    }

    logger.info('Cypress::resetUsers')
    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  resetUsers,
}
