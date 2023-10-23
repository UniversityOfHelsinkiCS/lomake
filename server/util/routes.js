const Router = require('express')
const users = require('@controllers/usersController')
const answers = require('@controllers/answersController')
const studyprogrammes = require('@controllers/studyprogrammesController')
const deadlines = require('@controllers/deadlineController')
const cypress = require('@controllers/cypressController')
const faculties = require('@controllers/facultyController')
const degreeReform = require('@controllers/degreeReformController')
const {
  checkAdmin,
  requireProgrammeRead,
  requireProgrammeWrite,
  requireProgrammeOwner,
  notInProduction,
  requireFacultyRead,
  checkAdminOrKatselmusryhma,
} = require('@middleware/accessControlMiddleware')

const router = Router()

router.get('/reform/temp', checkAdminOrKatselmusryhma, degreeReform.getAllTemp)
router.get('/reform/faculties/:faculty', requireFacultyRead, degreeReform.getForFaculty)
router.get('/answers', checkAdmin, answers.getAll)
router.get('/answers/temp', answers.getAllTempUserHasAccessTo)
router.get('/answers/single/:form/:programme/:year', requireProgrammeRead, answers.getSingleProgrammesAnswers)
router.get('/answers/degreeReform/currentAnswer', answers.getIndividualFormAnswerForUser)
router.get('/answers/degreeReform/getAllAnswersForUser', answers.getAllIndividualAnswersForUser)
router.put('/answers/:form/:programme/:year/updateAnswersReady', requireProgrammeWrite, answers.updateAnswerReady)
router.put('/answers/individual/:uid/updateReady', answers.updateIndividualReady)
router.get('/answers/foruser', answers.getAllUserHasAccessTo)
router.get('/answers/forSummary/:code/:lang', answers.getFacultySummaryData)
router.get('/answers/forSummary/:code', answers.getProgrammeSummaryData)
router.get('/answers/oldSummaryYearly/faculty/:code/:lang', answers.getOldFacultySummaryData)
router.get('/answers/currentSummaryEvaluation/faculty/:code/:lang', answers.getEvaluationSummaryDataForFaculty)
router.get('/answers/:form/:programme/previous', requireProgrammeRead, answers.getPreviousYear)
router.post('/answers/degreeReform/individualAnswer', answers.postIndividualFormAnswer)
router.post('/answers/degreeReform/individualAnswer/partial', answers.postIndividualFormPartialAnswer)
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

router.get('/faculties', faculties.getAll)

router.get('/cypress/seed', notInProduction, cypress.seed)
router.get('/cypress/createAnswers/:form', notInProduction, cypress.createAnswers)

module.exports = router
