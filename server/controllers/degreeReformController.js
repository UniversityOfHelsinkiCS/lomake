const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')

const getAllTemp = async (_, res) => {
  try {
    const data = await db.tempAnswer.findAll({
      attributes: ['id', 'data', 'year', 'ready'],
      where: {
        form: 3,
        programme: {
          [Op.not]: '',
        },
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
