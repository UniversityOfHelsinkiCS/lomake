const logger = require('@util/logger')
const db = require('@models/index')

const userMiddleware = async (req, res, next) => {
  if (req.path.includes('socket.io')) next()
  try {
    const [user, created] = await db.user.findOrCreate({
      where: {
        uid: req.headers.uid
      },
      defaults: {
        name: `${req.headers.givenname} ${req.headers.sn}`,
        email: req.headers.mail,
        admin: false,
        access: false,
        irrelevant: false
      }
    })
    if (created) logger.info(`New user: ${user.name}, ${user.email}`)
    req.user = user
  } catch (error) {
    logger.error('Database error:', error)
  }

  next()
}

module.exports = userMiddleware
