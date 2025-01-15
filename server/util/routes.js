import Router from 'express'
import users from '../controllers/usersController.js'
import answers from '../controllers/answersController.js'
import studyprogrammes from '../controllers/studyprogrammesController.js'
import deadlines from '../controllers/deadlineController.js'
import cypress from '../controllers/cypressController.js'
import faculty from '../controllers/facultyController.js'
import degreeReform from '../controllers/degreeReformController.js'
import locks from '../controllers/lockController.js'

import {
  checkAdmin,
  requireProgrammeRead,
  requireProgrammeWrite,
  requireProgrammeOwner,
  notInProduction,
  requireFacultyRead,
  checkAdminOrKatselmusryhma,
  requireUniFormRight,
} from '../middleware/accessControlMiddleware.js'

import config from '../controllers/configController.js'

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

router.post('/reports/', reports.createReport)
router.get('/reports/:studyprogrammeId/', reports.getReports)
router.get('/reports/:studyprogrammeId/:year', reports.getReport)
router.delete('/reports/:studyprogrammeId/:year', reports.deleteReport)
router.get('/reports/:studyprogrammeId/:year/comments/', reports.getComments)
router.put('/reports/:studyprogrammeId/:year/comments/', reports.createOrUpdateComments)
router.delete('/reports/:studyprogrammeId/:year/comments/', reports.deleteComments)
router.get('/reports/:studyprogrammeId/:year/actions/', reports.getActions)
router.put('/reports/:studyprogrammeId/:year/actions/', reports.createOrUpdateActions)
router.delete('/reports/:studyprogrammeId/:year/actions/', reports.deleteActions)

router.get('/cypress/seed', notInProduction, cypress.seed)
router.get('/cypress/createAnswers/:form', notInProduction, cypress.createAnswers)
router.get('/cypress/createFacultyAnswers/:form', notInProduction, cypress.createFacultyAnswers)

router.get('/config/data', config.getData)

export default router
