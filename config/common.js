/**
 * Insert application wide common items here
 */

const inProduction = process.env.NODE_ENV === 'production'
const requiredGroupForWideReadAccess = inProduction ? "grp-lomake-production-read" : "grp-lomake-testing-read"

const basePath = process.env.BASE_PATH || '/'

// First one is the current year, after that all the years that have answers
const defaultYears = [2021, 2020, 2019]

const degreeLevels = [
  'Bachelor´s level (1. cycle)',
  'Master´s level (2. cycle)',
  'Doctoral level (3. cycle)',
]

const requiredFormIds = [
  'faculty',
  'degree_level',
  'programme',
  'review_of_last_years_situation_report',
  'student_admissions_light',
  'student_admissions_text',
  'language_environment_light',
  'language_environment_text',
  'programme_identity_light',
  'programme_identity_text',
  'employability_light',
  'employability_text',
  'learning_outcomes_light',
  'learning_outcomes_text',
  'curriculum_light',
  'curriculum_text',
  'guidance_light',
  'guidance_text',
  'student_feedback_light',
  'student_feedback_text',
  'community_wellbeing_light',
  'community_wellbeing_text',
  'teacher_skills_light',
  'teacher_skills_text',
  'management_light',
  'management_text',
  'teaching_resources_light',
  'teaching_resources_text',
  'recruitment_influence_light',
  'recruitment_influence_text',
  'resourcing_light',
  'resourcing_text',
  'successes_and_development_needs_text',
  'measures_1_text',
]

const SUPERADMINS = ['mluukkai', 'saarasat', 'admin']

const isSuperAdmin = (uid) => {
  return SUPERADMINS.includes(uid)
}

const isAdmin = (user) => user.admin 

const isBasicUser = (user) => {
  if (!user.admin && !user.wideReadAccess) return true
  return false
}

const isWideReadAccessUser = (user) => user.isWideReadAccess

const isSpecialGroupUser = (user) => {
  if (user.specialGroup && Object.keys(user.specialGroup) && Object.keys(user.specialGroup).length > 0) return true
  return false
}

const isInternationalUser = (user) => {
  if (user.specialGroup && Object.keys(user.specialGroup) && user.specialGroup['international']) return true
  return false
}


const internationalAccess = {
  MH50_004: { 'read': true, 'year':2020 },
  MH50_010: { 'read': true, 'year':2020 },
  MH40_005: { 'read': true, 'year':2020 },
  MH57_001: { 'read': true, 'year':2020 },
  MH80_004: { 'read': true, 'year':2020 },
  MH50_002: { 'read': true, 'year':2020 },
  MH40_003: { 'read': true, 'year':2020 },
  MH40_011: { 'read': true, 'year':2020 },
  MH70_006: { 'read': true, 'year':2020 },
  MH57_003: { 'read': true, 'year':2020 },
  MH50_011: { 'read': true, 'year':2020 },
  MH70_003: { 'read': true, 'year':2020 },
  MH80_005: { 'read': true, 'year':2020 },
  MH50_006: { 'read': true, 'year':2020 },
  MH20_002: { 'read': true, 'year':2020 },
  MH57_002: { 'read': true, 'year':2020 },
  MH50_013: { 'read': true, 'year':2020 },
  MH50_007: { 'read': true, 'year':2020 },
  MH50_012: { 'read': true, 'year':2020 },
  MH80_002: { 'read': true, 'year':2020 },
  MH80_001: { 'read': true, 'year':2020 },
  MH50_001: { 'read': true, 'year':2020 },
  MH50_005: { 'read': true, 'year':2020 },
  MH80_003: { 'read': true, 'year':2020 },
  MH80_007: { 'read': true, 'year':2020 },
  MH57_004: { 'read': true, 'year':2020 },
  MH70_005: { 'read': true, 'year':2020 },
  MH70_009: { 'read': true, 'year':2020 },
  MH50_003: { 'read': true, 'year':2020 },
  MH50_009: { 'read': true, 'year':2020 },
  MH30_002: { 'read': true, 'year':2020 },
  MH40_004: { 'read': true, 'year':2020 },
  MH57_005: { 'read': true, 'year':2020 },
  MH60_002: { 'read': true, 'year':2020 },
  MH20_003: { 'read': true, 'year':2020 },
}

const cypressUsers = [
  {
    uid: 'cypressUser',
    firstname: 'cyp',
    lastname: 'res',
    email: 'cypressUser',
    admin: false,
    access: {},
  },
  {
    uid: 'cypressUser2',
    firstname: 'cyp2',
    lastname: 'res2',
    email: 'cypressUser2',
    admin: false,
    access: {},
  },
  {
    uid: 'cypressUser3',
    firstname: 'cyp3',
    lastname: 'res3',
    email: 'cypress-user-3@helsinki.fi',
    admin: false,
    specialGroup: {},
    access: {
      KH50_004: { 'read': true, 'write': true },
      KH80_001: { 'read': true, 'write': true, 'admin': true },
      KH50_003: { 'read': true }
    }
  },
  {
    uid: 'cypressInternationalUser',
    firstname: 'cyp4',
    lastname: 'res4',
    email: 'cypress-international-user@helsinki.fi',
    admin: false,
    specialGroup: { 'international2020': true },
    access: internationalAccess
  },
  {
    uid: 'cypressAdminUser',
    firstname: 'cypress',
    lastname: 'admin',
    email: 'cypressAdminUser',
    admin: true,
  },
]

const testProgrammeName = 'TOSKA101'

module.exports = {
  inProduction,
  basePath,
  defaultYears,
  degreeLevels,
  requiredFormIds,
  isSuperAdmin,
  isAdmin,
  isWideReadAccessUser,
  isBasicUser,
  isSpecialGroupUser,
  isInternationalUser,
  cypressUsers,
  testProgrammeName,
  requiredGroupForWideReadAccess
}
