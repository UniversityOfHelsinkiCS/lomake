const db = require('@models/index')
const logger = require('@util/logger')

const claimToken = async (req, res) => {
  try {
    const token = await db.token.findOne({ where: { url: req.params.url } })
    if (!token || !token.valid) {
      logger.error(
        `User ${req.user.uid} tried to use invalid token url: ${req.params.url}`
      )
      return res.status(403).json({ error: 'invalid token url' })
    }

    if (!token.valid) {
      logger.error(
        `User ${req.user.uid} tried to use expired token url: ${req.params.url}`
      )
      return res.status(403).json({ error: 'expired token url' })
    }

    if (token.type === 'ADMIN') {
      req.user.access = {
        ...req.user.access,
        [token.programme]: { admin: true, write: true, read: true }
      }
    }

    if (token.type === 'WRITE') {
      req.user.access = {
        ...req.user.access,
        [token.programme]: {
          ...req.user.access[token.programme],
          write: true,
          read: true
        }
      }
    }

    if (token.type === 'READ') {
      req.user.access = {
        ...req.user.access,
        [token.programme]: { ...req.user.access[token.programme], read: true }
      }
    }

    await req.user.save()
    await token.increment('usageCounter')
    if (token.type === 'ADMIN') {
      token.valid = false
    }
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
  claimToken
}
