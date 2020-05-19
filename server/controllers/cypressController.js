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

const resetTokens = async (req, res) => {
  try {
    const testProgramme = 'TOSKA101'

    await db.token.destroy({
      where: {
        programme: testProgramme,
      },
    })

    const tokens = [
      {
        url: 'readTest',
        programme: testProgramme,
        type: 'READ',
        valid: true,
        usageCounter: 0,
      },
      {
        url: 'writeTest',
        programme: testProgramme,
        type: 'WRITE',
        valid: true,
        usageCounter: 0,
      },
      {
        url: 'adminTest',
        programme: testProgramme,
        type: 'ADMIN',
        valid: true,
        usageCounter: 0,
      },
    ]

    for (const token of tokens) {
      await db.token.create(token)
    }

    logger.info('Cypress::resetTokens')
    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  resetUsers,
  resetTokens,
}
