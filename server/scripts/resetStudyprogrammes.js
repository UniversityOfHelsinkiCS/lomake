const db = require('@models/index')
const logger = require('@util/logger')
const { programmes } = require('@util/common')

const resetStudyprogrammes = async () => {
  try {
    logger.info('Resetting study programmes table')
    await db.studyprogramme.destroy({ where: {} })

    for (const programme of programmes) {
      const { key, name } = programme

      await db.studyprogramme.create({
        key,
        name,
        locked: false,
        claimed: false,
      })
    }
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

module.exports = {
  resetStudyprogrammes,
}
