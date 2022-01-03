const { inProduction } = require('@util/common')
const logger = require('@util/logger')

const requireProgrammeRead = (req, res, next) => {
  const { programme } = req.params
  if (req.user.hasWideReadAccess) next()
  else if (req.user.access[programme] && req.user.access[programme].read) next()
  else return res.status(401).json({ error: 'Unauthorized access.' }).end()
}

const requireProgrammeWrite = (req, res, next) => {
  const { programme } = req.params
  if (req.user.admin) next()
  else if (req.user.access[programme] && req.user.access[programme].write) next()
  else return res.status(401).json({ error: 'Unauthorized access.' }).end()
}

const requireProgrammeOwner = (req, res, next) => {
  const { programme } = req.params
  if (req.user.admin) next()
  else if (req.user.access[programme] && req.user.access[programme].admin) next()
  else return res.status(401).json({ error: 'Unauthorized access.' }).end()
}

const checkAdmin = (req, res, next) => {
  if (req.user.admin) {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized access.' }).end()
  }
}

const notInProduction = (req, res, next) => {
  if (!inProduction) {
    next()
  } else {
    logger.error(`Test-only route (${req.method} ${req.url}) was requested while in production mode.`)
    return res.status(404).end()
  }
}

module.exports = {
  notInProduction,
  requireProgrammeRead,
  requireProgrammeWrite,
  requireProgrammeOwner,
  checkAdmin,
}
