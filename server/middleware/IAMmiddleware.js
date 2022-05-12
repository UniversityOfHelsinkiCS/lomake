const { inProduction } = require('@util/common')
const { getIAMRights } = require('@util/IAMrights')

const IAMmiddleware = async (req, _, next) => {
  if (req.path.includes('socket.io')) return next()
  if (!inProduction && req.path.includes('/cypress/')) return next()

  const { user } = req
  const { headers } = req

  if (!inProduction) {
    // testing iam group based access granting
    const { newAccess, newSpecialGroup } = getIAMRights(headers?.hygroupcn)
    user.access = {
      ...user.access, 
      ...newAccess
    }
    user.specialGroup = {
      ...user.specialGroup,
      ...newSpecialGroup
    }
    await user.save()
  }

  next()
}

module.exports = IAMmiddleware
