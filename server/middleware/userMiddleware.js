const logger = require('@util/logger')
const db = require('@models/index')
const { inProduction, isDevSuperAdminUid, isStagingSuperAdminUid } = require('@util/common')

// Some test-users have been pre-authorized:
const shouldBeSuperAdmin = uid => {
  const shouldBeSuper = (!inProduction && isDevSuperAdminUid(uid)) || isStagingSuperAdminUid(uid)
  return shouldBeSuper ? { superAdmin: true } : {}
}

const userMiddleware = async (req, res, next) => {
  const { headers, path } = req
  if (path.includes('socket.io')) next()
  if (path.includes('/cypress/')) return next()
  const { uid, givenname, sn, mail } = headers
  if (!uid) {
    logger.error('missing uid')
    return res.status(400).json({ error: 'missing uid' })
  }
  try {
    const [user, created] = await db.user.findOrCreate({
      where: {
        uid,
      },
      defaults: {
        firstname: givenname,
        lastname: sn,
        email: mail,
        access: {},
        specialGroup: shouldBeSuperAdmin(req.headers.uid),
      },
    })
    if (created) logger.info(`New user: ${user.lastname}, ${user.firstname}, ${user.email}`)
    req.user = user

    next()
  } catch (error) {
    logger.error('Database error:', error)
  }
}

module.exports = userMiddleware
