const { iamsInUse } = require('../../config/common')
const { getIAMRights } = require('@util/IAMrights')

const IAMmiddleware = async (req, _, next) => {
  if (req.path.includes('socket.io')) return next()
  if (req.path.includes('/cypress/')) return next()

  const { user } = req
  const { headers } = req

  if (iamsInUse) {
    const { newAccess, newSpecialGroup } = getIAMRights(headers?.hygroupcn)
    user.access = newAccess
    user.specialGroup = newSpecialGroup
    await user.save()
  }

  next()
}

module.exports = IAMmiddleware
