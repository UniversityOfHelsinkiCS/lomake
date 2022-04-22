const { inProduction } = require('@util/common')
const logger = require('@util/logger')

const parseHyGroups = hyGroups => {
  let parsedHyGroups = []
  if (!(hyGroups === undefined || hyGroups === '' || hyGroups === null)) {
    parsedHyGroups = hyGroups.split(';')
  }
  return parsedHyGroups
}

const IAMmiddleware = async (req, res, next) => {
  if (req.path.includes('socket.io')) return next()
  if (!inProduction && req.path.includes('/cypress/')) return next()

  const { user } = req
  const { headers } = req

  user.hyGroups = parseHyGroups(headers?.hygroupcn)

  logger.info(`User ${user.uid} logged in with groups ${user.hyGroups}`)

  next()
}

module.exports = IAMmiddleware
