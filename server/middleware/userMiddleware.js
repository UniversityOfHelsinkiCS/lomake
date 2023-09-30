const logger = require('@util/logger')
const db = require('@models/index')

const userMiddleware = async (req, res, next) => {
  if (req.path.includes('socket.io')) return next()
  if (req.path.includes('/cypress/')) return next()
  if (!req.headers.uid) {
    logger.error('missing uid')
    return res.status(400).json({ error: 'missing uid' })
  }
  try {
    const start = new Date().valueOf()
    const [user, created] = await db.user.findOrCreate({
      where: {
        uid: req.headers.uid,
      },
      defaults: {
        firstname: req.headers.givenname,
        lastname: req.headers.sn,
        email: req.headers.mail,
        access: {},
        specialGroup: {},
      },
    })
    const end = new Date().valueOf()
    logger.info(`DEBUG userMiddleware query ${(end - start) / 1000} sec ${req.headers.uid} ${req.baseUrl}`)
    if (created) logger.info(`New user: ${user.lastname}, ${user.firstname}, ${user.email}`)
    req.user = user

    return next()
  } catch (error) {
    logger.error('Database error:', error)
    return undefined
  }
}

module.exports = userMiddleware
