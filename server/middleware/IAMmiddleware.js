const { inProduction } = require('@util/common')
const logger = require('@util/logger')

const parseHyGroups = (hyGroups) => {
  let parsedHyGroups = []
  if (!(hyGroups === undefined || hyGroups === '')) {
    parsedHyGroups = hyGroups.split(';')
  }
  return parsedHyGroups
}

const hasRequiredGroup = (hyGroups) => {
  const requiredGroup = inProduction ? 'grp-lomake-production-read' : 'grp-lomake-staging-read'
  return hyGroups.some((e) => e === requiredGroup)
}

const shouldHaveWideReadAccess = (headers) => {
  const hyGroups = parseHyGroups(headers['hygroupcn'])
  return hasRequiredGroup(hyGroups)
}

const IAMmiddleware = async (req, res, next) => {
  if (req.path.includes('socket.io')) return next()
  if (!inProduction && req.path.includes('/cypress/')) return next()

  const user = req.user

  const userShouldHaveWideReadAccess = shouldHaveWideReadAccess(req.headers)

  // Admins won't be granted wideReadAccess, because they already have "wide read" access.
  if (user.wideReadAccess !== userShouldHaveWideReadAccess && !user.admin) {
    user.wideReadAccess = userShouldHaveWideReadAccess
    await user.save()
    logger.info(`Wide read access ${user.wideReadAccess ? 'given to' : 'removed from'} ${user.uid}`)
  }

  next()
}

module.exports = IAMmiddleware
