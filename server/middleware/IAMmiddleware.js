const { iamToOrganisationCode, iamToFacultyCode, isDoctoralIam, doctoralProgrammeCodes } = require('@root/config/iamToCodes')
const { data } = require('@root/config/data')
const { inProduction, mapToDegreeCode } = require('@util/common')
const logger = require('@util/logger')

const iamForKandiAndMasters = ['hy-ltdk-psyk-jory', 'hy-ltdk-logo-jory']

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
 * Grant reading rights to all doctoral programmes if the user belongs to doctoral IAM
 * @param {string[]} hyGroups
 */
const getDoctoralReadingRights = hyGroups => {
  const hasDoctoralReadingRights = hyGroups.some(group => isDoctoralIam(group))
  const newDoctoralReadAccess = {}
  const newDoctoralSpecialGroups = {}
  if (hasDoctoralReadingRights) {
    newDoctoralSpecialGroups['doctoral'] = true
    doctoralProgrammeCodes.forEach(code => {
      newDoctoralReadAccess[code] = { read: true }
    })
  }

  return { newDoctoralReadAccess, newDoctoralSpecialGroups }
}

/**
 * Grant reading rights to all programmes in the faculty, if the user is a dean of the faculty
 * @param {string[]} hyGroups
 */
const getFacultyReadingRights = hyGroups => {
  const facultyCodes = hyGroups.map(iam => iamToFacultyCode(iam)).filter(Boolean)
  const newFacultyReadAccess = {}
  const newFacultySpecialGroups = {}
  facultyCodes.forEach(code => {
    newFacultySpecialGroups[code] = true
    const faculty = data.find(f => f.code === code)
    faculty.programmes.forEach(p => {
      newFacultyReadAccess[p.key] = { read: true }
    })
  })

  return { newFacultyReadAccess, newFacultySpecialGroups }
}

const isStudyProgramLeader = (hyGroups) => false

/**
 * Grant admin access if the user belongs to studyprogramme's manager group and is a study program leader
 * @param {string[]} hyGroups
 */
const getProgramAdminAccess = hyGroups => {
  if (!isStudyProgramLeader(hyGroups)) return
  const orgCodes = hyGroups.map(iam => iamToOrganisationCode(iam)).filter(Boolean)
  const degreeCodes = orgCodes.flatMap(codes => codes.map(mapToDegreeCode))
  const newAccess = {}
  degreeCodes.forEach(code => {
    newAccess[code] = { read: true, write: true, admin: true }
  })

  return newAccess
}

const isEmployee = hyGroups => hyGroups.includes('hy-employees')
/**
 * Grant write and read access if the user belongs to employees group and studyprogramme's manager group
 * @param {string[]} hyGroups
 */
const getWriteAccess = hyGroups => {
  if (!isEmployee(hyGroups)) return
  const orgCodes = hyGroups.map(iam => iamToOrganisationCode(iam)).filter(Boolean)
  const degreeCodes = orgCodes.flatMap(codes => codes.map(mapToDegreeCode))
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
  const degreeCodes = orgCodes.flatMap(codes => codes.map(mapToDegreeCode))
  const newAccess = {}
  degreeCodes.forEach(code => {
    newAccess[code] = { read: true }
  })

  return newAccess
}

const grantUserRights = async (user, hyGroups) => {
  const { 
    newFacultyReadAccess, 
    newFacultySpecialGroups
  } = getFacultyReadingRights(hyGroups)

  const {
    newDoctoralReadAccess, 
    newDoctoralSpecialGroups
  } = getDoctoralReadingRights(hyGroups)

  user.access = {
    ...user.access,
    ...newDoctoralReadAccess,
    ...newFacultyReadAccess,
    ...getReadAccess(hyGroups),
    ...getWriteAccess(hyGroups),
    ...getProgramAdminAccess(hyGroups), // order matters here: last overwrites previous keys
  }

  user.specialGroup = {
    ...user.specialGroup,
    ...newDoctoralSpecialGroups,
    ...newFacultySpecialGroups,
    ...getAdmin(hyGroups),
    ...getSuperAdmin(hyGroups),
  }

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
