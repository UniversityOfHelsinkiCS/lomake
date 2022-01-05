const db = require('@models/index')
const logger = require('@util/logger')
const { v4: uuid } = require('uuid')

const generateMissingTokens = async () => {
  try {
    logger.info(`Making sure that all programmes have pre-made tokens ready`)

    const types = ['ADMIN', 'READ', 'WRITE']
    const existingTokens = await db.token.findAll({})
    const programmes = await db.studyprogramme.findAll({})
    let newCreated = 0

    programmes.forEach(async programme => {
      const { key } = programme

      types.forEach(async type => {
        const exists = existingTokens.find(token => token.type === type && token.programme === key)
        if (!exists) {
          newCreated++
          await db.token.create({
            url: uuid(),
            programme: key,
            type,
            valid: true,
            usageCounter: 0,
          })
        }
      })
    })
    logger.info(`${newCreated} new tokens created`)
  } catch (error) {
    logger.error(`Failed to generate missing tokens: ${error}`)
  }
}
module.exports = {
  generateMissingTokens,
}
