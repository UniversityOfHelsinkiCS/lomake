const db = require('@models/index')
const logger = require('@util/logger')
const { uuid } = require('uuidv4')
const { programmes } = require('@util/common')

const resetAllTokens = async () => {
  try {
    logger.info(`Performing full token reset.`)
    await db.token.destroy({ where: {} })

    for (const programme of programmes) {
      const { key } = programme
      await db.token.create({
        url: uuid(),
        programme: key,
        type: 'ADMIN',
        valid: true,
        usageCounter: 0,
      })
      await db.token.create({
        url: uuid(),
        programme: key,
        type: 'READ',
        valid: true,
        usageCounter: 0,
      })
      await db.token.create({
        url: uuid(),
        programme: key,
        type: 'WRITE',
        valid: true,
        usageCounter: 0,
      })
    }

    // Create tokens for faculty wide read-links:
    const faculties = await db.faculty.findAll()
    for (const faculty of faculties) {
      await db.token.create({
        url: uuid(),
        faculty: faculty.code,
        type: 'READ',
        valid: true,
        usageCounter: 0,
      })
    }
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}
module.exports = {
  resetAllTokens,
}
