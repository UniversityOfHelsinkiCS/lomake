import Router from 'express'
import users from '../controllers/usersController.js'
import answers from '../controllers/answersController.js'
import studyprogrammes from '../controllers/studyprogrammesController.js'
import deadlines from '../controllers/deadlineController.js'
import cypress from '../controllers/cypressController.js'
import faculty from '../controllers/facultyController.js'
import degreeReform from '../controllers/degreeReformController.js'
import locks from '../controllers/lockController.js'
import reports, { ReportResponse } from '../controllers/reportsController.js'
import keyData from '../controllers/keyDataController.js'
import documents from '../controllers/documentsController.js'

import {
  checkAdmin,
  requireProgrammeRead,
  requireProgrammeWrite,
  requireProgrammeOwner,
  notInProduction,
  requireFacultyRead,
  checkAdminOrKatselmusryhma,
  requireUniFormRight,
  requireDekanaatti,
} from '../middleware/accessControlMiddleware.js'

const router = Router()

router.post('/lock/:room', locks.getLock)

router.get('/reform/temp', checkAdminOrKatselmusryhma, degreeReform.getAllTemp)
router.get('/reform/faculties/:faculty', requireFacultyRead, degreeReform.getForFaculty)
router.get('/reform/university/:dropdownFilter', requireUniFormRight, degreeReform.getForUniversity)
router.get('/answers', checkAdmin, answers.getAll)
router.get('/answers/temp', answers.getAllTempUserHasAccessTo)
router.get('/answers/temp/:form/:year', answers.getFacultyTempAnswersAfterDeadline)
router.get('/answers/temp/:form', answers.getFacultyTempAnswersByForm)
router.get('/answers/single/:form/:programme/:year', requireProgrammeRead, answers.getSingleProgrammesAnswers)
router.get('/answers/degreeReform/currentAnswer', answers.getIndividualFormAnswerForUser)
router.get('/answers/degreeReform/getAllAnswersForUser', answers.getAllIndividualAnswersForUser)
router.put('/answers/:form/:programme/:year/updateAnswersReady', requireProgrammeWrite, answers.updateAnswerReady)
router.put('/answers/individual/:uid/updateReady', answers.updateIndividualReady)
router.get('/answers/foruser', answers.getAllUserHasAccessTo)
router.get('/answers/foruser/all', answers.getAllUserHasAccessTo)
router.get('/answers/committeeSummary/:code/:lang', answers.getCommitteeSummaryData)
router.get('/answers/forSummary/:code/:lang', answers.getFacultySummaryData)
router.get('/answers/forSummary/:code', answers.getProgrammeSummaryData)
router.get('/answers/oldSummaryYearly/faculty/:code/:lang', answers.getOldFacultySummaryData)
router.get('/answers/currentSummaryEvaluation/faculty/:code/:lang', answers.getEvaluationSummaryDataForFaculty)
router.get('/answers/:form/:programme/previous', requireProgrammeRead, answers.getPreviousYear)
router.post('/answers/degreeReform/individualAnswer', answers.postIndividualFormAnswer)
router.post('/answers/degreeReform/individualAnswer/partial', answers.postIndividualFormPartialAnswer)
router.get('/answers/committee/FIN/:year', answers.getDataFromFinnishUniForm)
router.get('/programmes/:programme/users', requireProgrammeOwner, users.getProgrammesUsers)
router.get('/programmes/getOwners', checkAdmin, studyprogrammes.getOwners)
router.get('/programmes', studyprogrammes.getAll)
router.get('/programmes/foruser', studyprogrammes.getUsersProgrammes)
router.get('/programmes/:programme', studyprogrammes.getOne)
router.post('/programmes/:programme/toggleLock/:form', requireProgrammeOwner, studyprogrammes.toggleLock)
router.post('/programmes/update', checkAdmin, studyprogrammes.updateAll)

router.post('/login', users.getCurrentUser) // IAM-middleware checks this path
router.post('/logout', users.getLogoutUrl)

router.get('/users', checkAdmin, users.getAllUsers)
router.post('/users/tempAccess', checkAdmin, users.saveTempAccess)
router.delete('/users/tempAccess/:uid/:programme', checkAdmin, users.deleteTempAccess)

router.get('/deadlines', deadlines.get)
router.post('/deadlines', checkAdmin, deadlines.createOrUpdate)
router.delete('/deadlines', checkAdmin, deadlines.remove)

router.get('/faculties', faculty.getAll)

router.get('/reports/:year', reports.getReports)
router.get('/reports/:studyprogrammeKey/:year', reports.getReport)
router.put('/reports/:studyprogrammeKey/:year', requireProgrammeWrite, reports.updateReport)

router.get('/keydata', keyData.getKeyData)
router.post('/keydata', checkAdmin, keyData.uploadKeyData)
router.get('/keydata/meta', checkAdmin, keyData.getKeyDataMeta)
router.delete('/keydata/:id', checkAdmin, keyData.deleteKeyData)
router.put('/keydata/:id', checkAdmin, keyData.updateKeyData)

router.get('/documents/:studyprogrammeKey', documents.getDocuments)
router.post('/documents/:studyprogrammeKey', requireProgrammeWrite, documents.createDocument)
router.put('/documents/:studyprogrammeKey/:id', requireProgrammeWrite, documents.updateDocument)
router.put('/documents/:studyprogrammeKey/close/all', requireDekanaatti, documents.closeInterventionProcedure)

router.get('/cypress/seed', notInProduction, cypress.seed)
router.get('/cypress/createAnswers/:form', notInProduction, cypress.createAnswers)
router.get('/cypress/createFacultyAnswers/:form', notInProduction, cypress.createFacultyAnswers)
router.get('/cypress/initKeydata', notInProduction, cypress.initKeyData)

export default router
