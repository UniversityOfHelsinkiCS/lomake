import { Router } from 'express'
import users from '../controllers/usersController.js'
import answers from '../controllers/answersController.js'
import studyprogrammes from '../controllers/studyprogrammesController.js'
import deadlines from '../controllers/deadlineController.js'
import cypress from '../controllers/cypressController.js'
import faculty from '../controllers/facultyController.js'
import degreeReform from '../controllers/degreeReformController.js'
import locks from '../controllers/lockController.js'
import reports from '../controllers/reportsController.js'
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
import { getJoryMapFromJami, getOrganisationData } from './jami.js'

const router = Router()

router.post('/lock/:room', async (req, res) => { await locks.getLock(req, res) })
router.get('/lock/:room', async (req, res) => { await locks.fetchLocks(req, res) })
router.post('/lock', async (req, res) => { await locks.setLock(req, res) })
router.delete('/lock', async (req, res) => { await locks.deleteLock(req, res) })

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

router.get('/login', users.getCurrentUser) // IAM-middleware checks this path
router.post('/logout', users.getLogoutUrl)

router.get('/users', checkAdmin, users.getAllUsers)
router.post('/users/tempAccess', checkAdmin, users.saveTempAccess)
router.delete('/users/tempAccess/:uid/:programme', checkAdmin, users.deleteTempAccess)

router.get('/deadlines', deadlines.get)
router.post('/deadlines', checkAdmin, deadlines.createOrUpdate)
router.delete('/deadlines', checkAdmin, deadlines.remove)

router.get('/faculties', faculty.getAll)

router.get('/reports/:year', async (req, res) => { await reports.getReports(req, res) })
router.get('/reports/:programme/:year', async (req, res) => { await reports.getReport(req, res) })
router.put('/reports/:programme/:year', requireProgrammeWrite, async (req, res) => { await reports.updateReport(req, res) })

router.get('/keydata', async (req, res) => { await keyData.getKeyData(req, res) })
router.post('/keydata', checkAdmin, async (req, res) => { await keyData.uploadKeyData(req, res) })
router.get('/keydata/meta', checkAdmin, async (req, res) => { await keyData.getKeyDataMeta(req, res) })
router.delete('/keydata/:id', checkAdmin, async (req, res) => { await keyData.deleteKeyData(req, res) })
router.put('/keydata/:id', checkAdmin, async (req, res) => { await keyData.updateKeyData(req, res) })

router.get('/documents/all/:activeYear', async (req, res) => { await documents.getAllDocuments(req, res) })
router.get('/documents/:programme', async (req, res) => { await documents.getDocuments(req, res) })
router.post('/documents/:programme', requireProgrammeWrite, async (req, res) => { await documents.createDocument(req, res) })
router.put('/documents/:programme/:id', requireProgrammeWrite, async (req, res) => { await documents.updateDocument(req, res) })
router.put('/documents/:programme/close/all', requireDekanaatti, async (req, res) => { await documents.closeInterventionProcedure(req, res) })

router.get('/organisation-data', async (_, res) => { const data = await getOrganisationData(); res.send(data) })

router.get('/jory-map', async (_, res) => { const joryMap = await getJoryMapFromJami(); res.send(joryMap) })

router.get('/cypress/seed', notInProduction, cypress.seed)
router.get('/cypress/createAnswers/:form', notInProduction, cypress.createAnswers)
router.get('/cypress/createFacultyAnswers/:form', notInProduction, cypress.createFacultyAnswers)
router.get('/cypress/initKeydata', notInProduction, cypress.initKeyData)
router.get('/cypress/resetDocuments', notInProduction, cypress.resetDocuments)

export default router
