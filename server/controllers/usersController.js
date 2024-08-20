const { Op } = require('sequelize')
const db = require('../models')
const logger = require('../util/logger')
const { getLastRestart } = require('../util/lastRestart')
const { isAdmin } = require('../util/common')
const { sendNewTempAccessNotification } = require('./mailController')

const getCurrentUser = async (req, res) => {
  if (req.user && !req.headers['x-admin-logged-in-as']) {
    try {
      const now = new Date()
      await db.user.update(
        { lastLogin: now },
        {
          where: {
            uid: req.user.uid,
          },
        },
      )
    } catch (error) {
      logger.error(`Failed to update the last login for user: ${req.user.uid}`)
    }
  }

  if (isAdmin(req.user)) {
    const lastRestart = getLastRestart()
    const response =
      typeof req.user.toJSON === 'function' ? { ...req.user.toJSON(), lastRestart } : { ...req.user, lastRestart }

    return res.send(response)
  }

  return res.send(req.user)
}

const getLogoutUrl = async (req, res) => {
  try {
    const logoutUrl = req.headers.shib_logout_url || req.headers.logout_url
    const { returnUrl } = req.body
    if (logoutUrl) {
      return res
        .status(200)
        .send({ logoutUrl: `${logoutUrl}?return=${returnUrl || ''}` })
        .end()
    }
    return res
      .status(200)
      .send({ logoutUrl: returnUrl || '' })
      .end()
  } catch (err) {
    return res.status(500).json({ message: 'Error with logout', err })
  }
}

const getAllUsers = async (_, res) => {
  try {
    const users = await db.user.findAll({})
    res.json(users)
  } catch (e) {
    logger.error(e)
    res.status(500).json({ error: 'Database error' })
  }
}

const getProgrammesUsers = async (req, res) => {
  try {
    const users = await db.user.findAll({})
    const { programme } = req.params

    const filteredUsers = users.filter(u => u.access[programme])

    return res.json(filteredUsers)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'Database error' })
  }
}

const saveTempAccess = async (req, res) => {
  try {
    const newAccess = req.body
    const email = newAccess.email.toLowerCase()

    const user = await db.user.findOne({
      where: {
        email: {
          [Op.iLike]: email,
        },
      },
    })

    if (!user) return res.status(400).json({ error: 'user not found' })

    const temps = user.tempAccess
    let brandNew = false
    let toUpdate = []

    const oldAccess = temps.find(access => access.programme === newAccess.programme)
    if (oldAccess) {
      toUpdate = temps.map(t => {
        if (t.programme === newAccess.programme) {
          return {
            ...t,
            endDate: newAccess.endDate,
            writingRights: newAccess.writingRights,
            lastEditor: newAccess.givenBy,
            editedAt: new Date(),
          }
        }
        return t
      })
    } else {
      brandNew = true
      toUpdate = [
        ...temps,
        {
          programme: newAccess.programme,
          createdAt: new Date(),
          endDate: newAccess.endDate,
          writingRights: newAccess.writingRights,
          lastEditor: newAccess.givenBy,
          editedAt: new Date(),
        },
      ]
    }

    const updatedUser = await user.update({ tempAccess: toUpdate })

    if (updatedUser) {
      if (brandNew) {
        await sendNewTempAccessNotification(
          `${user.firstname} ${user.lastname}`,
          newAccess.progNames,
          newAccess.kojoEmail,
        )
      }
      return res.status(200).json(updatedUser)
    }
    return res.status({})
  } catch (e) {
    logger.error(e.message)
    return res.status(500).json({ error: 'Database error' })
  }
}

const deleteTempAccess = async (req, res) => {
  try {
    const user = await db.user.findOne({
      where: {
        uid: req.params.uid,
      },
    })

    const temps = user.tempAccess
    const toUpdate = temps.filter(t => t.programme !== req.params.programme)

    const updatedUser = await user.update({ tempAccess: toUpdate })
    if (updatedUser) {
      logger.info(
        `Temporary access of user ${user.uid} to programme ${req.params.programme} was deleted by ${req.user.firstname} ${req.user.lastname}`,
      )
      return res.status(200).json(updatedUser)
    }
    return res.status({})
  } catch (e) {
    logger.error(e.message)
    return res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getCurrentUser,
  getLogoutUrl,
  getAllUsers,
  getProgrammesUsers,
  saveTempAccess,
  deleteTempAccess,
}
