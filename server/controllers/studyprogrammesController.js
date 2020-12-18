const db = require('@models/index')
const logger = require('@util/logger')

const getAll = async (req, res) => {
  try {
    const data = await db.studyprogramme.findAll({
      attributes: {
        exclude: ['id', 'primaryFacultyId', 'createdAt', 'updatedAt'],
      },
      include: ["primaryFaculty","companionFaculties"],
    })
    res.status(200).json(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const getUsersProgrammes = async (req, res) => {
  try {
    if (req.user.hasWideReadAccess) {
      const data = await db.studyprogramme.findAll({
        attributes: {
          exclude: ['id', 'primaryFacultyId', 'createdAt', 'updatedAt'],
        },
        include: ["primaryFaculty","companionFaculties"],
      })
      return res.status(200).json(data)
    } else {
      const data = await db.studyprogramme.findAll({
        where: {
          key: Object.keys(req.user.access)
        },
        attributes: {
          exclude: ['id', 'primaryFacultyId', 'createdAt', 'updatedAt'],
        },
        include: ["primaryFaculty","companionFaculties"],
      })
      return res.status(200).json(data)
    }
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const getOne = async (req, res) => {
  try {
    const { programme } = req.params
    const programEntity = await db.studyprogramme.findOne({ 
      where: { 
        key: programme 
      },
      include: ["primaryFaculty","companionFaculties"],
    })
    res.status(200).json(programEntity)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const toggleLock = async (req, res) => {
  try {
    const upcomingDeadlinesCount = await db.deadline.count()

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

/**
 * Only returns email-addresses for safety.
 */
const getOwners = async (req, res) => {
  try {
    const programmes = await db.studyprogramme.findAll()
    let results = {}

    for (const p of programmes) {
      const owners = await db.user.findAll({
        where: {
          access: {
            [p.key]: { admin: 'true' },
          },
        },
      })
      results = {
        ...results,
        [p.key]: owners.map((o) => o.email),
      }
    }
    res.status(200).json(results)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getAll,
  getUsersProgrammes,
  getOne,
  toggleLock,
  getOwners,
}
