const { iamToOrganisationCode } = require('@root/config/iamToOrganisationCode')
const { inProduction, mapToDegreeCode } = require('@util/common')
const logger = require('@util/logger')

const parseHyGroups = hyGroups => {
  let parsedHyGroups = []
  if (!(hyGroups === undefined || hyGroups === '' || hyGroups === null)) {
    parsedHyGroups = hyGroups.split(';')
  }
  return parsedHyGroups
}

const getSuperAdmin = (hyGroups) => {
  const isToska = hyGroups.includes('grp-toska')
  if (isToska) {
    return { superAdmin: true }
  }
}

const getAdmin = (hyGroups) => {
  const isOspa = hyGroups.includes('grp-ospa')
  if (isOspa) {
    return { admin: true }
  }
}

/**
 * Grant admin access if the user belongs to studyprogramme's manager group and is a study program leader
 * @param {string[]} hyGroups 
 */
const getProgramAdminAccess = (hyGroups) => {
  hyGroups.includes('grp-toska')
  const orgCodes = hyGroups.map(iam => iamToOrganisationCode(iam)).filter(Boolean)
  const degreeCodes = orgCodes.map(mapToDegreeCode)
  const newAccess = {}
  degreeCodes.forEach(code => {
    newAccess[code] = { read: true }
  })
  // console.log(newAccess)
  return newAccess
}

const isEmployee = (hyGroups) => hyGroups.includes('hy-employees')

/**
 * Grant write access if the user belongs to employees group and studyprogramme's manager group
 * @param {string[]} hyGroups 
 */
const getWriteAccess = (hyGroups) => {
  if (!isEmployee(hyGroups)) return
  const orgCodes = hyGroups.map(iam => iamToOrganisationCode(iam)).filter(Boolean)
  const degreeCodes = orgCodes.map(mapToDegreeCode)
  const newAccess = {}
  degreeCodes.forEach(code => {
    newAccess[code] = { read: true, write: true }
  })

  return newAccess
}

/**
 * Grant read access if the user belongs to studyprogramme's manager group
 * @param {string[]} hyGroups 
 */
const getReadAccess = (hyGroups) => {
  const orgCodes = hyGroups.map(iam => iamToOrganisationCode(iam)).filter(Boolean)
  const degreeCodes = orgCodes.map(mapToDegreeCode)
  const newAccess = {}
  degreeCodes.forEach(code => {
    newAccess[code] = { read: true }
  })

  return newAccess
}

const grantUserRights = async (user, hyGroups) => {
  const updatedAccess = {
    ...user.access,
    ...getReadAccess(hyGroups),
    ...getWriteAccess(hyGroups),
    ...getProgramAdminAccess(hyGroups) // order matters here: last overwrites previous keys
  }
  user.access = updatedAccess

  const specialGroup = { 
    ...user.specialGroup, 
    ...getAdmin(user, hyGroups),
    ...getSuperAdmin(user, hyGroups)
  }
  user.specialGroup = specialGroup

  await user.save()
}

const IAMmiddleware = async (req, res, next) => {
  if (req.path.includes('socket.io')) return next()
  if (!inProduction && req.path.includes('/cypress/')) return next()

  const { user } = req
  const { headers } = req

  if (!inProduction) {
    // testing iam group based access granting
    const hyGroups = parseHyGroups(headers?.hygroupcn)
    await grantUserRights(user, hyGroups)
    logger.info(`User ${user.uid} logged in with groups ${hyGroups}`)
  }

  next()
}

module.exports = IAMmiddleware
