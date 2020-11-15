/**
 * Insert application wide common items here
 */

const inProduction = process.env.NODE_ENV === 'production'

const basePath = process.env.BASE_PATH || '/'

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
  'student_admissions_color',
  'student_admissions_text',
  'language_environment_color',
  'language_environment_text',
  'programme_identity_color',
  'programme_identity_text',
  'employability_color',
  'employability_text',
  'learning_outcomes_color',
  'learning_outcomes_text',
  'curriculum_color',
  'curriculum_text',
  'guidance_color',
  'guidance_text',
  'student_feedback_color',
  'student_feedback_text',
  'community_wellbeing_color',
  'community_wellbeing_text',
  'teacher_skills_color',
  'teacher_skills_text',
  'management_color',
  'management_text',
  'teaching_resources_color',
  'teaching_resources_text',
  'recruitment_influence_color',
  'recruitment_influence_text',
  'resourcing_color',
  'resourcing_text',
  'successes_and_development_needs_text',
  'measures_1_text',
]

const SUPERADMINS = ['markokos', 'jehelen', 'mluukkai', 'saarasat', 'kopaakko', 'admin']

const isSuperAdmin = (uid) => {
  return SUPERADMINS.includes(uid)
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
  degreeLevels,
  requiredFormIds,
  isSuperAdmin,
  cypressUsers,
  testProgrammeName,
}
