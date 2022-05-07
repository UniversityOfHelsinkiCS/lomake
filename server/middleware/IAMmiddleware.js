const { inProduction } = require('@util/common')
const { grantUserRights } = require('@util/IAMrights')
const logger = require('@util/logger')

const IAMmiddleware = async (req, res, next) => {
  if (req.path.includes('socket.io')) return next()
  if (!inProduction && req.path.includes('/cypress/')) return next()

  const { user } = req
  const { headers } = req

  if (!inProduction) {
    // testing iam group based access granting
    await grantUserRights(user, headers?.hygroupcn)
    logger.info(`User ${user.uid} logged in with groups ${hyGroups}`)
  }

  next()
}

module.exports = IAMmiddleware
