const { iamToOrganisationCode, iamToFacultyCode, isDoctoralIam, doctoralProgrammeCodes, isUniversityWideIam } = require('@root/config/iamToCodes')
const { data } = require('@root/config/data')
const { mapToDegreeCode } = require('@util/common')
const logger = require('./logger')


const parseHyGroupsFromHeader = hyGroups => {
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
 * Grant reading rights to all programmes if user has uni wide IAM (eg. hy-rehtoraatti)
 * @param {string[]} hyGroups 
 * @returns read access to ALL programmes
 */
const getUniversityReadingRights = hyGroups => {
  const hasUniversityReadingRights = hyGroups.some(isUniversityWideIam)
  const newUniversityWideReadAccess = {}
  const newUniversityWideSpecialGroups = {}
  if (hasUniversityReadingRights) {
    newUniversityWideSpecialGroups['allProgrammes'] = true
    data.forEach(faculty => {
      faculty.programmes.forEach(program => {
        newUniversityWideReadAccess[program.key] = { read: true }
      })
    })
  }
  return { newUniversityWideReadAccess, newUniversityWideSpecialGroups }
}

/**
 * Grant reading rights to all doctoral programmes if the user belongs to doctoral IAM
 * @param {string[]} hyGroups
 * @returns read access to ALL doctoral programs
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
 * Grants reading rights to all doctoral programmes that belong to user's 
 * doctoral school IAMs
 * @param {string[]} hyGroups 
 * @returns read access to doctoral programs
 */
const getDoctoralSchoolReadingRights = hyGroups => {
  const doctoralProgrammeCodes = hyGroups.map(group => getDoctoralSchoolReadingRights(group)).flatMap()
  const newDoctoralProgramAccess = {}
  doctoralProgrammeCodes.forEach(code => {
    newDoctoralProgramAccess[code] = { read: true }
  })
  return newDoctoralProgramAccess
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

/**
 * Saves user organisation access rights and special groups, 
 * based on IAM-groups in IAM header string
 * @param {User} user 
 * @param {string} hyGroupsHeader 
 */
const grantUserRights = async (user, hyGroupsHeader) => {
  const hyGroups = parseHyGroupsFromHeader(hyGroupsHeader)

  const { 
    newFacultyReadAccess, 
    newFacultySpecialGroups
  } = getFacultyReadingRights(hyGroups)

  const {
    newDoctoralReadAccess, 
    newDoctoralSpecialGroups
  } = getDoctoralReadingRights(hyGroups)

  const {
    newUniversityWideReadAccess,
    newUniversityWideSpecialGroups
  } = getUniversityReadingRights(hyGroups)

  user.access = {
    ...user.access,
    ...newUniversityWideReadAccess,
    ...newDoctoralReadAccess,
    ...newFacultyReadAccess,
    ...getDoctoralSchoolReadingRights,
    ...getReadAccess(hyGroups),
    ...getWriteAccess(hyGroups),
    ...getProgramAdminAccess(hyGroups), // order matters here: last overwrites previous keys
  }

  user.specialGroup = {
    ...user.specialGroup,
    ...newUniversityWideSpecialGroups,
    ...newDoctoralSpecialGroups,
    ...newFacultySpecialGroups,
    ...getAdmin(hyGroups),
    ...getSuperAdmin(hyGroups),
  }

  await user.save()

  logger.info(`User ${user.uid} logged in with groups ${hyGroups}`)
}

module.exports = {
  grantUserRights
}
