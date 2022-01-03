const db = require('@models/index')
const logger = require('@util/logger')

const getAll = async (req, res) => {
  try {
    const data = await db.faculty.findAll({
      include: ['ownedProgrammes', 'companionStudyprogrammes'],
      order: [['code', 'ASC']],
    })

    res.status(200).json(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getAll,
}
