import Faculty from '../models/faculty.js'
import logger from '../util/logger.js'

const getAll = async (_, res) => {
  try {
    const data = await Faculty.findAll({
      include: ['ownedProgrammes', 'companionStudyprogrammes'],
      order: [['code', 'ASC']],
    })

    return res.status(200).json(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

export default { getAll }
