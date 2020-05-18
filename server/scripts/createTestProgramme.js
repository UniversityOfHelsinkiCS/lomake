const db = require('@models/index')
const logger = require('@util/logger')

const createTestProgramme = async () => {
  try {
    logger.info('Creating testprogramme')

    const testprogrammeKey = 'TOSKA101'

    await db.studyprogramme.destroy({ where: { key: testprogrammeKey } })

    await db.studyprogramme.create({
      key: testprogrammeKey,
      name: {
        en: 'TOSKA-en',
        fi: 'TOSKA-fi',
        se: 'TOSKA-se',
      },
      locked: false,
      claimed: false,
    })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

module.exports = {
  createTestProgramme,
}
