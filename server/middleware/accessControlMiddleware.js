import { inProduction } from '../util/common.js'
import { isAdmin, isSuperAdmin, isKatselmusProjektiOrOhjausryhma } from '../../config/common.js'
import logger from '../util/logger.js'

const requireProgrammeRead = (req, res, next) => {
  if (isAdmin(req.user) || isSuperAdmin(req.user)) next()
  else if (Object.values(req.user?.access || {}).some(a => a.read)) next()
  else res.status(401).json({ error: 'Unauthorized access.' }).end()
}

const requireFacultyRead = (req, res, next) => {
  const { faculty } = req.params
  if (isAdmin(req.user) || isSuperAdmin(req.user)) next()
  else if (req.user.access[faculty]) next()
  else res.status(401).json({ error: 'Unauthorized access.' }).end()
}

const requireUniFormRight = (req, res, next) => {
  if (isAdmin(req.user) || isSuperAdmin(req.user)) next()
  else if (req.user.specialGroup.universityForm) next()
  else res.status(401).json({ error: 'Unauthorized access.' }).end()
}

const requireProgrammeWrite = (req, res, next) => {
  const { programme } = req.params
  if (isAdmin(req.user) || isSuperAdmin(req.user)) next()
  else if (req.user.access[programme] && req.user.access[programme].write) next()
  else res.status(401).json({ error: 'Unauthorized access.' }).end()
}

const requireProgrammeOwner = (req, res, next) => {
  const { programme } = req.params
  if (isAdmin(req.user) || isSuperAdmin(req.user)) next()
  else if (req.user.access[programme] && req.user.access[programme].admin) next()
  else res.status(401).json({ error: 'Unauthorized access.' }).end()
}

const checkAdmin = (req, res, next) => {
  if (isAdmin(req.user) || isSuperAdmin(req.user)) {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized access.' }).end()
  }
}

const checkAdminOrKatselmusryhma = (req, res, next) => {
  if (isAdmin(req.user) || isSuperAdmin(req.user) || isKatselmusProjektiOrOhjausryhma(req.user)) {
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
    res.status(404).end()
  }
}

export {
  notInProduction,
  requireFacultyRead,
  requireProgrammeRead,
  requireProgrammeWrite,
  requireProgrammeOwner,
  checkAdmin,
  checkAdminOrKatselmusryhma,
  requireUniFormRight,
}
