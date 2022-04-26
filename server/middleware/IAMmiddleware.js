const { iamToOrganisationCode, iamToFacultyCode } = require('@root/config/iamToCodes')
const { data } = require('@root/config/data')
const { inProduction, mapToDegreeCode } = require('@util/common')
const logger = require('@util/logger')

const parseHyGroups = hyGroups => {
  let parsedHyGroups = []
  if (!(hyGroups === undefined || hyGroups === '' || hyGroups === null)) {
    parsedHyGroups = hyGroups.split(';')
  }
  return parsedHyGroups
}

const getSuperAdmin = hyGroups => {
  const isToska = hyGroups.includes('grp-toska')
  if (isToska) {
    return { superAdmin: true }
  }
}

const getAdmin = hyGroups => {
  const isOspa = hyGroups.includes('grp-ospa')
  if (isOspa) {
    return { admin: true }
  }
}

/**
 * Grant reading rights to all programmes in the faculty, if the user is a dean of the faculty
 * @param {string[]} hyGroups
 */
const getFacultyReadingRights = hyGroups => {
  const facultyCodes = hyGroups.map(iam => iamToFacultyCode(iam)).filter(Boolean)
  const newAccess = {}
  const newSpecialGroups = {}
  facultyCodes.forEach(code => {
    newSpecialGroups[code] = true
    const faculty = data.find(f => f.code === code)
    faculty.programmes.forEach(p => {
      newAccess[p.key] = { read: true }
    })
  })

  return { newSpecialGroups, newAccess }
}

/**
 * Grant admin access if the user belongs to studyprogramme's manager group and is a study program leader
 * @param {string[]} hyGroups
 */
const getProgramAdminAccess = hyGroups => {
  const orgCodes = hyGroups.map(iam => iamToOrganisationCode(iam)).filter(Boolean)
  const degreeCodes = orgCodes.map(mapToDegreeCode)
  const newAccess = {}
  degreeCodes.forEach(code => {
    newAccess[code] = { read: true }
  })

  return newAccess
}

const isEmployee = hyGroups => hyGroups.includes('hy-employees')
/**
 * Grant write access if the user belongs to employees group and studyprogramme's manager group
 * @param {string[]} hyGroups
 */
const getWriteAccess = hyGroups => {
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
const getReadAccess = hyGroups => {
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
    ...getFacultyReadingRights(hyGroups).newAccess,
    ...getReadAccess(hyGroups),
    ...getWriteAccess(hyGroups),
    ...getProgramAdminAccess(hyGroups), // order matters here: last overwrites previous keys
  }
  user.access = updatedAccess

  const specialGroup = {
    ...user.specialGroup,
    ...getFacultyReadingRights(hyGroups).newSpecialGroups,
    ...getAdmin(hyGroups),
    ...getSuperAdmin(hyGroups),
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
