import { Op } from 'sequelize'
import db from '../models/index.js'
import {
  iamsInUse,
  inProduction,
  inStaging,
  internationalAccess,
  basePath,
  defaultYears,
  degreeLevels,
  requiredFormIds,
  isSuperAdmin,
  isDevSuperAdminUid,
  isAdmin,
  isBasicUser,
  isSpecialGroupUser,
  isInternationalUser,
  isEvaluationFacultyUser,
  hasSomeReadAccess,
  testProgrammeCode,
  testProgrammeName,
  testFacultyCode,
  testFacultyName,
  testProgrammeCodeDoctor,
  testProgrammeNameDoctor,
  testIAM,
  LOMAKE_SINCE_YEAR,
  getYearsArray,
  mapToDegreeCode,
  requiredDegreeReformIds,
  isKatselmusProjektiOrOhjausryhma,
  isEvaluationUniversityUser,
} from '../../config/common.js'
import { formKeys } from '../../config/data.js'

const DATABASE_URL = process.env.DATABASE_URL || ''
const PORT = process.env.PORT || 8001
const AUTOMATIC_IAM_PERMISSIONS_ENABLED = process.env.AUTOMATIC_IAM_PERMISSIONS_ENABLED === 'true'

const { JAMI_URL } = process.env
const API_TOKEN = process.env.API_TOKEN || ''

const whereDraftYear = async () => {
  const draftYears = await db.draftYear.findAll({})
  const draftYear = draftYears.length ? draftYears[0].year : new Date().getFullYear()
  return draftYear || { [Op.is]: null }
}

const getFormType = form => {
  if (form === formKeys.YEARLY_ASSESSMENT) {
    return 'yearly'
  }
  if (form === formKeys.DEGREE_REFORM_PROGRAMMES) {
    return 'degree-reform'
  }
  if (form === formKeys.DEGREE_REFORM_INDIVIDUALS) {
    return 'degree-reform-individual'
  }
  if (form === formKeys.EVALUATION_PROGRAMMES) {
    return 'evaluation'
  }
  if (form === formKeys.EVALUATION_FACULTIES) {
    return 'evaluation-faculty'
  }
  if (form === formKeys.EVALUATION_COMMTTEES) {
    return 'evaluation-university'
  }
  return 'yearly'
}

export {
  DATABASE_URL,
  JAMI_URL,
  API_TOKEN,
  PORT,
  AUTOMATIC_IAM_PERMISSIONS_ENABLED,
  whereDraftYear,
  getFormType,
  iamsInUse,
  inProduction,
  inStaging,
  internationalAccess,
  basePath,
  defaultYears,
  degreeLevels,
  requiredFormIds,
  isSuperAdmin,
  isDevSuperAdminUid,
  isAdmin,
  isBasicUser,
  isSpecialGroupUser,
  isInternationalUser,
  isEvaluationFacultyUser,
  hasSomeReadAccess,
  testProgrammeCode,
  testProgrammeName,
  testFacultyCode,
  testFacultyName,
  testProgrammeCodeDoctor,
  testProgrammeNameDoctor,
  testIAM,
  LOMAKE_SINCE_YEAR,
  getYearsArray,
  mapToDegreeCode,
  requiredDegreeReformIds,
  isKatselmusProjektiOrOhjausryhma,
  isEvaluationUniversityUser,
}
