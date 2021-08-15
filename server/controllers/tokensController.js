const db = require('@models/index')
const logger = require('@util/logger')
const { uuid } = require('uuidv4')

const claimToken = async (req, res) => {
  try {
    const token = await db.token.findOne({ where: { url: req.params.url } })
    if (!token || !token.valid) {
      logger.error(`User ${req.user.uid} tried to use invalid token url: ${req.params.url}`)
      return res.status(403).json({ error: 'invalid token url' })
    }

    if (!token.valid) {
      logger.error(`User ${req.user.uid} tried to use expired token url: ${req.params.url}`)
      return res.status(403).json({ error: 'expired token url' })
    }

    if (token.type === 'ADMIN') {
      req.user.access = {
        ...req.user.access,
        [token.programme]: { admin: true, write: true, read: true },
      }

      // Also set this programme as claimed, if it has not been marked as claimed already:
      const programme = await db.studyprogramme.findOne({
        where: {
          key: token.programme,
        },
      })

      if (!programme.claimed) {
        programme.claimed = true
        await programme.save()
      }
    }

    if (token.type === 'WRITE') {
      req.user.access = {
        ...req.user.access,
        [token.programme]: {
          ...req.user.access[token.programme],
          write: true,
          read: true,
        },
      }
    }

    if (token.type === 'READ') {
      req.user.access = {
        ...req.user.access,
        [token.programme]: { ...req.user.access[token.programme], read: true },
      }
    }

    await req.user.save()
    await token.increment('usageCounter')
    if (token.type === 'ADMIN') token.valid = false
    await token.save()

    logger.info(
      `User ${req.user.uid} claimed token : ${req.params.url}, ${token.programme}: ${token.type}`
    )
    return res.status(200).json(req.user)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const checkToken = async (req, res) => {
  try {
    const token = await db.token.findOne({ where: { url: req.params.url } })
    if (!token) {
      logger.error(`User ${req.user.uid} tried to use non-existing token: ${req.params.url}`)
      return res.status(403).json({ error: 'invalid token url' })
    }

    if (!token.valid) {
      logger.error(`User ${req.user.uid} tried to use expired token: ${req.params.url}`)
      return res.status(403).json({ error: 'expired token url' })
    }

    return res.status(200).json(token)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const programmesTokens = async (req, res) => {
  try {
    const tokens = await db.token.findAll({
      where: { programme: req.params.programme, valid: true },
    })

    return res.status(200).json(tokens)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const resetAdminToken = async (req, res) => {
  try {
    const { url } = req.params
    const token = await db.token.findOne({ where: { url } })

    token.url = uuid()
    token.valid = true
    token.usageCounter = 0
    await token.save()

    logger.info(`User ${req.user.uid} resetted admin token for programme: ${token.programme} from ${url} to ${token.url}`)

    return res.status(200).json(token)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const resetToken = async (req, res) => {
  try {
    const { url } = req.params
    const token = await db.token.findOne({ where: { url } })

    token.url = uuid()
    await token.save()

    logger.info(`User ${req.user.uid} changed token url from: ${url} to ${token.url}`)

    return res.status(200).json(token)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const createToken = async (req, res) => {
  try {
    const { type, programme } = req.params

    const newToken = await db.token.create({
      url: uuid(),
      programme,
      type,
      valid: true,
      usageCounter: 0,
    })

    logger.info(`User ${req.user.uid} initialized ${type}-token for ${programme}`)

    return res.status(200).json(newToken)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const getAll = async (req, res) => {
  try {
    const tokens = await db.token.findAll({})
    return res.status(200).json(tokens)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const claimFacultyToken = async (req, res) => {
  try {
    const token = await db.token.findOne({ where: { url: req.params.url } })
    if (!token || !token.valid) {
      logger.error(`User ${req.user.uid} tried to use invalid token url: ${req.params.url}`)
      return res.status(403).json({ error: 'invalid token url' })
    }

    if (!token.valid) {
      logger.error(`User ${req.user.uid} tried to use expired token url: ${req.params.url}`)
      return res.status(403).json({ error: 'expired token url' })
    }

    const faculty = await db.faculty.findOne({
      where: {
        code: token.faculty,
      },
      include:["ownedProgrammes"],
    })

    // Special type of token, where read permissions are given only for doctor-programmes:
    const doctorOnly = token.type === 'READ_DOCTOR'
    for (const {key} of faculty.ownedProgrammes) {
      if (doctorOnly) {
        if (key[0] !== 'T') continue
      }

      req.user.access = {
        ...req.user.access,
        [key]: { ...req.user.access[key], read: true },
      }
    }

    await req.user.save()
    await token.increment('usageCounter')
    await token.save()

    logger.info(
      `User ${req.user.uid} claimed token : ${req.params.url}, ${token.programme}: ${token.type}`
    )
    return res.status(200).json(req.user)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  claimToken,
  checkToken,
  programmesTokens,
  resetToken,
  resetAdminToken,
  createToken,
  getAll,
  claimFacultyToken,
}
