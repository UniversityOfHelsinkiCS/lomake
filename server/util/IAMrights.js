const {
  isSuperAdminIam,
  isAdminIam,
  isUniversityWideIam,
  isUniversityWideWritingIam,
  isDoctoralIam,
  isDoctoralWritingIam,
  getStudyLeaderGroup,
  iamToOrganisationCode,
  iamToDoctoralSchool,
  relevantIAMs,
  facultyWideWritingGroups,
  isUniverstyFormIam,
  hrHeadsGroup,
} = require('@root/config/IAMConfig')
const { data, committeeList } = require('@root/config/data')
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
 * Return given access to all programmes where predicate is true
 * (all if no predicate defined)
 * @param {object} accessLevel
 * @param {(program: object) => boolean} where
 * @returns {object} access to programmes
 */
const getAllProgrammeAccess = (accessLevel, where) => {
  const access = {}
  data.forEach(faculty => {
    faculty.programmes.forEach(program => {
      if (where?.(program) === false) return
      access[program.key] = { ...accessLevel }
    })
  })
  return access
}

/**
 * Grant super-admin rights to the Form if the user has correct iams (eg. grp-toska)
 * @param {string[]} hyGroups
 * @returns superAdmin special group
 */
const getSuperAdmin = hyGroups => {
  const isToska = hyGroups.some(isSuperAdminIam)
  if (isToska) {
    return { specialGroup: { superAdmin: true } }
  }
  return {}
}

/**
 * Grant admin rights to the Form if the user has correct iams (eg. hy-ypa-opa-ospa)
 * @param {string[]} hyGroups
 * @returns admin special group
 */
const getAdmin = hyGroups => {
  const isOspa = hyGroups.some(isAdminIam)
  if (isOspa) {
    return { specialGroup: { admin: true } }
  }
  return {}
}

/**
 * Grant reading rights to all programmes if user has uni wide IAM (eg. hy-rehtoraatti)
 * @param {string[]} hyGroups
 * @returns read access to ALL programmes
 */
const getUniversityReadingRights = hyGroups => {
  const hasUniversityReadingRights = hyGroups.some(isUniversityWideIam)
  if (!hasUniversityReadingRights) {
    return {}
  }

  const access = getAllProgrammeAccess({ read: true })
  const specialGroup = { allProgrammes: true }

  return { access, specialGroup }
}

/**
 * Grant writing rights to all programmes if user has uni wide writing IAM (eg. is a kosu)
 * @param {string[]} hyGroups
 * @returns write access to ALL programmes
 */
const getUniversityWriteAccess = hyGroups => {
  const hasUniversityWritingRights = hyGroups.some(isUniversityWideWritingIam)
  if (!hasUniversityWritingRights) {
    return {}
  }

  const access = getAllProgrammeAccess({ read: true, write: true })
  const specialGroup = { allProgrammes: true }

  return { access, specialGroup }
}

/**
 * Grant reading rights to all doctoral programmes if the user belongs to doctoral IAM
 * @param {string[]} hyGroups
 * @returns read access to ALL doctoral programs
 */
const getDoctoralAccess = hyGroups => {
  const hasDoctoralReadingRights = hyGroups.some(isDoctoralIam)
  if (!hasDoctoralReadingRights) return {}
  const access = getAllProgrammeAccess({ read: true }, program => program.level === 'doctoral')
  const specialGroup = { doctoral: true }

  return { access, specialGroup }
}

/**
 * Grant writing rights to all doctoral programmes if the user belongs to doctoral writing IAM (eg. doctoral kosu)
 * @param {string[]} hyGroups
 * @returns write access to ALL doctoral programs
 */
const getDoctoralWriteAccess = hyGroups => {
  const hasDoctoralWritingRights = hyGroups.some(isDoctoralWritingIam)
  if (!hasDoctoralWritingRights) return {}
  const access = getAllProgrammeAccess({ read: true, write: true }, program => program.level === 'doctoral')
  const specialGroup = { doctoral: true }

  return { access, specialGroup }
}

/**
 * Grants reading rights to all doctoral programmes that belong to user's
 * doctoral school IAMs
 * @param {string[]} hyGroups
 * @returns read access to doctoral programs
 */
const getDoctoralSchoolAccess = hyGroups => {
  const doctoralProgrammeCodes = hyGroups.flatMap(iamToDoctoralSchool)
  const access = {}
  doctoralProgrammeCodes.forEach(code => {
    if (!code) return
    access[code] = { read: true }
  })
  return { access }
}

/**
 * Grant admin access if the user belongs to studyprogramme's manager group and is a study program leader
 * @param {string[]} hyGroups
 */
const getProgrammeAdminAccess = hyGroups => {
  const orgCodes = hyGroups
    .filter(iam => hyGroups.includes(getStudyLeaderGroup(iam)))
    .map(iam => iamToOrganisationCode(iam))
    .filter(Boolean)

  const degreeCodes = orgCodes.flatMap(codes => codes.map(mapToDegreeCode))

  if (!degreeCodes?.length > 0) {
    return {}
  }

  const access = {}
  degreeCodes.forEach(code => {
    access[code] = { read: true, write: true, admin: true }
  })
  return { access }
}

/**
 * Grant write and read access if the user belongs to jory IAM
 * @param {string[]} hyGroups
 */
const getProgrammeWriteAccess = hyGroups => {
  const orgCodes = hyGroups.map(iam => iamToOrganisationCode(iam)).filter(Boolean)
  const degreeCodes = orgCodes.flatMap(codes => codes.map(mapToDegreeCode))
  const access = {}
  degreeCodes.forEach(code => {
    if (!code) return
    access[code] = { read: true, write: true }
  })

  return { access }
}

/**
 * Grant read access if the user belongs to jory IAM (Note that this currently overlaps write access, and is technically redundant)
 * @param {string[]} hyGroups
 */
const getProgrammeReadAccess = hyGroups => {
  const orgCodes = hyGroups.map(iam => iamToOrganisationCode(iam)).filter(Boolean)
  const degreeCodes = orgCodes.flatMap(codes => codes.map(mapToDegreeCode))
  const access = {}
  degreeCodes.forEach(code => {
    if (!code) return
    access[code] = { read: true }
  })

  return { access }
}

/**
 * Grant writing rights to specific faculty if the user belongs to faculty evaluation writing IAM (eg. grp-katselmus-mltdk)
 * @param {string[]} hyGroups
 * @returns write access to Katselmus faculty and read access to faculty's programmes
 */
const getFacultyKatselmusWriteAccess = hyGroups => {
  const hasFacultyWideWritingsRights = hyGroups.map(iam => facultyWideWritingGroups[iam]).filter(Boolean)
  const noFacultyRights = !hasFacultyWideWritingsRights[0] || hasFacultyWideWritingsRights.length === 0
  const access = {}
  let specialGroup = {}
  if (hyGroups.some(isUniverstyFormIam) || hrHeadsGroup.some(iam => hyGroups.includes(iam))) {
    data.forEach(faculty => {
      faculty.programmes.forEach(program => {
        access[program.key] = { read: true }
      })
      access[faculty.code] = { read: true, write: false }
    })
    specialGroup = { evaluationFaculty: true }
    if (noFacultyRights) {
      return { access, specialGroup }
    }
  }
  if (!hasFacultyWideWritingsRights[0] || hasFacultyWideWritingsRights.length === 0) return {}
  data.forEach(faculty => {
    if (hasFacultyWideWritingsRights.includes(faculty.code)) {
      faculty.programmes.forEach(program => {
        access[program.key] = { read: true }
      })
      access[faculty.code] = { read: true, write: true }
    }
  })
  specialGroup = { evaluationFaculty: true }
  return { access, specialGroup }
}

/**
 * Grant writing rights to university form to projektiryhma and the users of the form
 * @param {string[]} hyGroups
 * @returns write access to Katselmus university form
 */
const getUniversityFormAccess = hyGroups => {
  const hasUniversityFormWritingRights = hyGroups.some(isUniverstyFormIam)
  if (!hasUniversityFormWritingRights) return {}
  const access = {}

  committeeList.forEach(committeeLanguageVersion => {
    access[committeeLanguageVersion.code] = { read: true, write: true }
  })
  const specialGroup = { universityForm: true }
  return { specialGroup, access }
}

/**
 * Gets access rights and special groups,
 * based on IAM-groups in IAM header string
 * @param {string} hyGroupsHeader
 */
const getIAMRights = hyGroupsHeader => {
  const hyGroups = parseHyGroupsFromHeader(hyGroupsHeader)
  let access = {}
  let specialGroup = {}
  let iamGroups = []

  ;[
    getUniversityReadingRights,
    getUniversityFormAccess,
    getFacultyKatselmusWriteAccess,
    getDoctoralAccess,
    getDoctoralSchoolAccess,
    getProgrammeReadAccess,
    getProgrammeWriteAccess,
    getDoctoralWriteAccess,
    getUniversityWriteAccess,
    getProgrammeAdminAccess,
    getAdmin,
    getSuperAdmin,
  ]
    .map(f => f(hyGroups))
    .forEach(({ access: newAccess, specialGroup: newSpecialGroup }) => {
      access = { ...access, ...newAccess }
      specialGroup = { ...specialGroup, ...newSpecialGroup }
    })

  iamGroups = hyGroups.filter(iam => relevantIAMs.includes(iam))

  return { access, specialGroup, iamGroups }
}

module.exports = {
  getIAMRights,
}
