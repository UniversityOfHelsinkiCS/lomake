const db = require('@models/index')
const logger = require('@util/logger')

const createDeadlineIfNoneExist = async () => {
  try {
    const count = await db.deadline.count({
      where: {
        passed: false,
      },
    })

    if (count === 0) {
      await db.deadline.create({
        date: new Date(),
        passed: false,
      })
      logger.info('Created deadline because none existed')
    }
  } catch (error) {
    logger.error(`Failed to create deadline: ${error}`)
  }
}
module.exports = {
  createDeadlineIfNoneExist,
}
