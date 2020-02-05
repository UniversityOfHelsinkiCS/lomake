const { inProduction } = require('@util/common')
const logger = require('@util/logger')

const checkAccess = (req, res, next) => {
  if (req.user.access || req.user.admin) {
    next()
  } else {
    res
      .status(401)
      .json({ error: 'Unauthorized access.' })
      .end()
  }
}

const checkAdmin = (req, res, next) => {
  if (req.user.admin) {
    next()
  } else {
    res
      .status(401)
      .json({ error: 'Unauthorized access.' })
      .end()
  }
}

const notInProduction = (req, res, next) => {
  if (!inProduction) {
    next()
  } else {
    logger.error(
      `Test-only route (${req.method} ${req.url}) was requested while in production mode.`
    )
    return res.status(404).end()
  }
}

module.exports = {
  notInProduction,
  checkAccess,
  checkAdmin
}
