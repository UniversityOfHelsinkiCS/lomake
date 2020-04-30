const db = require('@models/index')
const logger = require('@util/logger')

const getAll = async (req, res) => {
  try {
    const data = await db.studyprogramme.findAll({})
    res.status(200).json(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const getOne = async (req, res) => {
  try {
    const { programme } = req.params
    const programEntity = await db.studyprogramme.findOne({ where: { key: programme } })
    res.status(200).json(programEntity)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const toggleLock = async (req, res) => {
  try {
    // First check if theres unpassed deadlines, if there are, only then lock can be toggled.
    const upcomingDeadlinesCount = await db.deadline.count({
      where: {
        passed: false,
      },
    })

    if (upcomingDeadlinesCount === 0) {
      return res.status(200).json({ message: 'Cant toggle.' })
    }

    const { programme } = req.params
    const programEntity = await db.studyprogramme.findOne({ where: { key: programme } })
    programEntity.locked = !programEntity.locked
    await programEntity.save()
    logger.info(`User ${req.user.uid} toggled edit-lock of ${programme}`)
    res.status(200).json(programEntity)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getAll,
  getOne,
  toggleLock,
}
