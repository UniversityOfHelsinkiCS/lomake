const db = require('@models/index')
const logger = require('@util/logger')
const { testProgrammeName } = require('@util/common')

const createTestProgramme = async () => {
  try {
    logger.info('Creating testprogramme')

    await db.studyprogramme.destroy({ where: { key: testProgrammeName } })

    await db.studyprogramme.create({
      key: testProgrammeName,
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
