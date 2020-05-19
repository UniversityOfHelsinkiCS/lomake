const db = require('@models/index')
const logger = require('@util/logger')
const { cypressUsers, testProgrammeName } = require('@util/common')

const resetUsers = async (req, res) => {
  try {
    for (const user of cypressUsers) {
      await db.user.destroy({ where: { uid: user.uid } })
      await db.user.create(user)
    }

    logger.info('Cypress::resetUsers')
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const resetTokens = async (req, res) => {
  try {
    await db.token.destroy({
      where: {
        programme: testProgrammeName,
      },
    })

    const tokens = [
      {
        url: 'readTest',
        programme: testProgrammeName,
        type: 'READ',
        valid: true,
        usageCounter: 0,
      },
      {
        url: 'writeTest',
        programme: testProgrammeName,
        type: 'WRITE',
        valid: true,
        usageCounter: 0,
      },
      {
        url: 'adminTest',
        programme: testProgrammeName,
        type: 'ADMIN',
        valid: true,
        usageCounter: 0,
      },
    ]

    for (const token of tokens) {
      await db.token.create(token)
    }

    logger.info('Cypress::resetTokens')
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const resetForm = async (req, res) => {
  try {
    logger.info('Cypress::resetForm')

    await db.tempAnswer.destroy({
      where: {
        programme: testProgrammeName,
      },
    })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const seed = async (req, res) => {
  try {
    logger.info('Cypress::seeding database')

    await resetUsers()
    await resetTokens()
    await resetForm()

    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  seed,
}
