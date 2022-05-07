const { inProduction } = require('@util/common')
const { grantUserRights } = require('@util/IAMrights')

const IAMmiddleware = async (req, res, next) => {
  if (req.path.includes('socket.io')) return next()
  if (!inProduction && req.path.includes('/cypress/')) return next()

  const { user } = req
  const { headers } = req

  if (!inProduction) {
    // testing iam group based access granting
    await grantUserRights(user, headers?.hygroupcn)
  }

  next()
}

module.exports = IAMmiddleware
