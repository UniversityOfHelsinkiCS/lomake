const Router = require('express')
const users = require('@controllers/usersController')
const answers = require('@controllers/answersController')
const tokens = require('@controllers/tokensController')
const studyprogrammes = require('@controllers/studyprogrammesController')
const deadlines = require('@controllers/deadlineController')
const cypress = require('@controllers/cypressController')
const faculties = require('@controllers/facultyController')
const {
  checkAdmin,
  requireProgrammeRead,
  requireProgrammeWrite,
  requireProgrammeOwner,
  notInProduction,
} = require('@middleware/accessControlMiddleware')

const router = Router()

router.get('/tokens', checkAdmin, tokens.getAll)
router.get('/answers', checkAdmin, answers.getAll)
router.get('/answers/temp', answers.getAllTempUserHasAccessTo)
router.get('/answers/temp/:programme', requireProgrammeRead, answers.getSingleTempAnswers)
router.get('/answers/foruser', answers.getAllUserHasAccessTo)
router.get('/answers/:programme', requireProgrammeRead, answers.getOne)
router.get('/answers/:programme/previous', requireProgrammeRead, answers.getPreviousYear)
router.post('/answers', requireProgrammeWrite, answers.create)
router.post('/bulkanswers', answers.bulkCreate)

router.get('/programmes/:programme/tokens', requireProgrammeOwner, tokens.programmesTokens)
router.post('/programmes/:programme/tokens/:url', requireProgrammeOwner, tokens.resetToken)
router.post('/programmes/:programme/tokens/create/:type', requireProgrammeOwner, tokens.createToken)
router.get('/programmes/:programme/users', requireProgrammeOwner, users.getProgrammesUsers)
router.put('/programmes/:programme/users/:id/access', requireProgrammeOwner, users.editUserAccess)
router.get('/programmes/getOwners', checkAdmin, studyprogrammes.getOwners)
router.get('/programmes', studyprogrammes.getAll)
router.get('/programmes/foruser', studyprogrammes.getUsersProgrammes)
router.get('/programmes/:programme', studyprogrammes.getOne)
router.post('/programmes/:programme/toggleLock', requireProgrammeOwner, studyprogrammes.toggleLock)
router.post('/programmes/update', checkAdmin, studyprogrammes.updateAll)

router.post('/login', users.getCurrentUser)
router.post('/logout', users.getLogoutUrl)

router.get('/users', checkAdmin, users.getAllUsers)
router.put('/users/:id', checkAdmin, users.editUser)
router.delete('/users/delete/:id', checkAdmin, users.deleteUser)

router.post('/access/:url', tokens.claimToken)
router.post('/access/:url/faculty', tokens.claimFacultyToken)
router.get('/access/:url', tokens.checkToken)

router.get('/deadlines', deadlines.get)
router.post('/deadlines', checkAdmin, deadlines.createOrUpdate)
router.delete('/deadlines', checkAdmin, deadlines.remove)

router.get('/faculties', faculties.getAll)

router.get('/cypress/seed', notInProduction, cypress.seed)
router.get(
  '/cypress/givePermissions/:uid/:programme/:level',
  notInProduction,
  cypress.givePermissions
)
router.get('/cypress/createAnswers', notInProduction, cypress.createAnswers)

module.exports = router
