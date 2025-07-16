import moment from 'moment'
import db from '../models/index.js'
import { isAdmin, isSuperAdmin, getFormType } from '../util/common.js'
import logger from '../util/logger.js'
import seed from '../scripts/seed.js'
import Studyprogramme from '../models/studyprogramme.js'

const getAll = async (_, res) => {
  try {
    const data = await Studyprogramme.findAll({
      attributes: {
        exclude: ['id', 'primaryFacultyId', 'createdAt', 'updatedAt'],
      },
      include: ['primaryFaculty', 'companionFaculties'],
    })
    return res.status(200).json(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getUsersProgrammes = async (req, res) => {
  try {
    if (isAdmin(req.user) || isSuperAdmin(req.user)) {
      const data = await Studyprogramme.findAll({
        attributes: {
          exclude: ['id', 'primaryFacultyId', 'createdAt', 'updatedAt'],
        },
        include: ['primaryFaculty', 'companionFaculties'],
      })
      return res.status(200).json(data)
    }
    const data = await Studyprogramme.findAll({
      where: {
        key: Object.keys(req.user.access),
      },
      attributes: {
        exclude: ['id', 'primaryFacultyId', 'createdAt', 'updatedAt'],
      },
      include: ['primaryFaculty', 'companionFaculties'],
    })
    return res.status(200).json(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getOne = async (req, res) => {
  try {
    const { programme } = req.params
    const programEntity = await Studyprogramme.findOne({
      where: {
        key: programme,
      },
      include: ['primaryFaculty', 'companionFaculties'],
    })

    return res.status(200).json(programEntity)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const updateAll = async (_, res) => {
  try {
    await seed()
    return res.status(200).json({
      status: `
        Studyprogrammes successfully updated at: ${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}.
        Refresh the page to see the results.
      `,
    })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error })
  }
}

const toggleLock = async (req, res) => {
  try {
    const upcomingDeadlinesCount = await db.deadline.count()

    if (upcomingDeadlinesCount === 0) {
      return res.status(200).json({ message: 'Cant toggle.' })
    }
    const { programme, form } = req.params
    const formInt = parseInt(form, 10)

    const programEntity = await Studyprogramme.findOne({ where: { key: programme } })
    programEntity.lockedForms[getFormType(formInt)] = !programEntity.lockedForms[getFormType(formInt)]
    programEntity.changed('lockedForms', true)
    await programEntity.save()
    logger.info(`User ${req.user.uid} toggled edit-lock of ${programme}`)
    return res.status(200).json(programEntity)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

/**
 * Only returns email-addresses for safety.
 */
const getOwners = async (_, res) => {
  try {
    const programmes = await Studyprogramme.findAll()
    let results = {}

    programmes.forEach(async p => {
      const owners = await db.user.findAll({
        where: {
          access: {
            [p.key]: { admin: 'true' },
          },
        },
      })
      results = {
        ...results,
        [p.key]: owners.map(o => o.email),
      }
    })
    return res.status(200).json(results)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

export default { getAll, getUsersProgrammes, getOne, updateAll, toggleLock, getOwners }
