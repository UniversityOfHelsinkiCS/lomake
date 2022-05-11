const {
  isSuperAdminIam,
  isAdminIam,
  isUniversityWideIam,
  isDoctoralIam,
  iamToFacultyCode,
  iamToKosu,
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
    newDoctoralSpecialGroups.allProgrammes = true
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

/**
 * Grant reading rights to all programmes in the faculties of the campus, if the user belongs to corresponding kosu group
 * @param {string[]} hyGroups
 */
const getKosuReadingRights = hyGroups => {
  const facultyCodes = hyGroups.flatMap(iam => iamToKosu(iam)).filter(Boolean)
  const newKosuReadAccess = {}
  const newKosuSpecialGroups = {}
  facultyCodes.forEach(code => {
    newKosuSpecialGroups[code] = true
    const faculty = data.find(f => f.code === code)
    faculty.programmes.forEach(p => {
      newKosuReadAccess[p.key] = { read: true }
    })
  })

  return { newKosuReadAccess, newKosuSpecialGroups }
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
 * Gets access rights and special groups,
 * based on IAM-groups in IAM header string
 * @param {string} hyGroupsHeader
 */
const getIAMRights = hyGroupsHeader => {
  const hyGroups = parseHyGroupsFromHeader(hyGroupsHeader)

  const { newFacultyReadAccess, newFacultySpecialGroups } = getFacultyReadingRights(hyGroups)

  const { newKosuReadAccess, newKosuSpecialGroups } = getKosuReadingRights(hyGroups)

  const { newDoctoralReadAccess, newDoctoralSpecialGroups } = getDoctoralReadingRights(hyGroups)

  const { newUniversityWideReadAccess, newUniversityWideSpecialGroups } = getUniversityReadingRights(hyGroups)

  const newAccess = {
    ...newUniversityWideReadAccess,
    ...newDoctoralReadAccess,
    ...newFacultyReadAccess,
    ...newKosuReadAccess,
    ...getDoctoralSchoolReadingRights,
    ...getReadAccess(hyGroups),
    ...getWriteAccess(hyGroups),
    ...getProgramAdminAccess(hyGroups), // order matters here: last overwrites previous keys
  }

  const newSpecialGroup = {
    ...newUniversityWideSpecialGroups,
    ...newDoctoralSpecialGroups,
    ...newFacultySpecialGroups,
    ...newKosuSpecialGroups,
    ...getAdmin(hyGroups),
    ...getSuperAdmin(hyGroups),
  }

  return { newAccess, newSpecialGroup }
}

module.exports = {
  getIAMRights,
}
