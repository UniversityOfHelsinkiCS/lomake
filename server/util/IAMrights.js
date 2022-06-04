const {
  isSuperAdminIam,
  isAdminIam,
  isUniversityWideIam,
  isDoctoralIam,
  getStudyLeaderGroup,
  iamToOrganisationCode,
  isEmployeeIam,
} = require('@root/config/IAMConfig')
const { data } = require('@root/config/data')
const { mapToDegreeCode } = require('@util/common')

/**
 * Parses the header string with IAM groups separated by semicolons
 * @param {string} hyGroups
 * @returns {string[]}
 */
const parseHyGroupsFromHeader = hyGroups => {
  let parsedHyGroups = []
  if (!(hyGroups === undefined || hyGroups === '' || hyGroups === null)) {
    parsedHyGroups = hyGroups.split(';')
  }
  return parsedHyGroups
}

/**
 * Grant super-admin rights to the Form if the user has correct iams (eg. grp-toska)
 * @param {string[]} hyGroups
 * @returns superAdmin special group
 */
const getSuperAdmin = hyGroups => {
  const isToska = hyGroups.some(isSuperAdminIam)
  if (isToska) {
    return { superAdmin: true }
  }
}

/**
 * Grant admin rights to the Form if the user has correct iams (eg. grp-ospa)
 * @param {string[]} hyGroups
 * @returns admin special group
 */
const getAdmin = hyGroups => {
  const isOspa = hyGroups.some(isAdminIam)
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
    newUniversityWideSpecialGroups.allProgrammes = true
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
  const hasDoctoralReadingRights = hyGroups.some(isDoctoralIam)
  const newDoctoralReadAccess = {}
  const newDoctoralSpecialGroups = {}
  if (hasDoctoralReadingRights) {
    newDoctoralSpecialGroups.doctoral = true
    data.forEach(faculty => {
      faculty.programmes.forEach(program => {
        if (program.level === 'doctoral') {
          newDoctoralReadAccess[program.key] = { read: true }
        }
      })
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
    if (!code.length) return
    newDoctoralProgramAccess[code] = { read: true }
  })
  return newDoctoralProgramAccess
}

/**
 * Grant admin access if the user belongs to studyprogramme's manager group and is a study program leader
 * @param {string[]} hyGroups
 */
const getProgramAdminAccess = hyGroups => {
  const orgCodes = hyGroups
    .filter(iam => hyGroups.includes(getStudyLeaderGroup(iam)))
    .map(iam => iamToOrganisationCode(iam))
    .filter(Boolean)

  const degreeCodes = orgCodes.flatMap(codes => codes.map(mapToDegreeCode))
  const newAccess = {}
  degreeCodes.forEach(code => {
    if (!code.length) return
    newAccess[code] = { read: true, write: true, admin: true }
  })

  return newAccess
}

/**
 * Grant write and read access if the user belongs to employees group and studyprogramme's manager group
 * @param {string[]} hyGroups
 */
const getWriteAccess = hyGroups => {
  if (!hyGroups.some(isEmployeeIam)) return
  const orgCodes = hyGroups.map(iam => iamToOrganisationCode(iam)).filter(Boolean)
  const degreeCodes = orgCodes.flatMap(codes => codes.map(mapToDegreeCode))
  const newAccess = {}
  degreeCodes.forEach(code => {
    if (!code.length) return
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
    if (!code.length) return
    newAccess[code] = { read: true }
  })
  return newAccess
}

/**
 * Gets access rights and special groups,
 * based on IAM-groups in IAM header string
 * @param {string} hyGroupsHeader
 */
const getIAMRights = hyGroupsHeader => {
  const hyGroups = parseHyGroupsFromHeader(hyGroupsHeader)

  const { newDoctoralReadAccess, newDoctoralSpecialGroups } = getDoctoralReadingRights(hyGroups)

  const { newUniversityWideReadAccess, newUniversityWideSpecialGroups } = getUniversityReadingRights(hyGroups)

  const newAccess = {
    ...newUniversityWideReadAccess,
    ...newDoctoralReadAccess,
    ...getDoctoralSchoolReadingRights,
    ...getReadAccess(hyGroups),
    ...getWriteAccess(hyGroups),
    ...getProgramAdminAccess(hyGroups), // order matters here: last overwrites previous keys
  }

  const newSpecialGroup = {
    ...newUniversityWideSpecialGroups,
    ...newDoctoralSpecialGroups,
    ...getAdmin(hyGroups),
    ...getSuperAdmin(hyGroups),
  }

  return { newAccess, newSpecialGroup }
}

module.exports = {
  getIAMRights,
}
