const Router = require('express')
const users = require('@controllers/usersController')
const answers = require('@controllers/answersController')
const tokens = require('@controllers/tokensController')
const studyprogrammes = require('@controllers/studyprogrammesController')
const {
  checkAdmin,
  requireProgrammeRead,
  requireProgrammeWrite,
  requireProgrammeOwner,
} = require('@middleware/accessControlMiddleware')

const router = Router()

router.get('/answers', checkAdmin, answers.getAll)
router.get('/answers/temp', answers.getAllTempUserHasAccessTo)
router.get('/answers/:programme', requireProgrammeRead, answers.getOne)
router.get('/answers/:programme/previous', requireProgrammeRead, answers.getPreviousYear)
router.post('/answers', requireProgrammeWrite, answers.create)
router.post('/bulkanswers', answers.bulkCreate)

router.get('/programmes/:programme/tokens', requireProgrammeOwner, tokens.programmesTokens)
router.post('/programmes/:programme/tokens/:url', requireProgrammeOwner, tokens.resetToken)
router.post('/programmes/:programme/tokens/create/:type', requireProgrammeOwner, tokens.createToken)
router.get('/programmes/:programme/users', requireProgrammeOwner, users.getProgrammesUsers)
router.put('/programmes/:programme/users/:id/access', requireProgrammeOwner, users.editUserAccess)
router.get('/programmes', studyprogrammes.getAll)

router.post('/login', users.getCurrentUser)
router.post('/logout', users.getLogoutUrl)

router.get('/users', checkAdmin, users.getAllUsers)
router.put('/users/:id', checkAdmin, users.editUser)

router.post('/access/:url', tokens.claimToken)
router.get('/access/:url', tokens.checkToken)

module.exports = router
