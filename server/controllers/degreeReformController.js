const db = require('@models/index')
const logger = require('@util/logger')

const getAllTemp = async (_, res) => {
  try {
    const data = await db.tempAnswer.findAll({
      where: {
        form: 3,
      },
    })
    return res.send(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getAllTemp,
}
