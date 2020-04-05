const Router = require('express')
const users = require('@controllers/usersController')
const answers = require('@controllers/answersController')
const tokens = require('@controllers/tokensController')
const {
  checkAdmin,
  requireProgrammeRead,
  requireProgrammeWrite,
  requireProgrammeOwner
} = require('@middleware/accessControlMiddleware')

const router = Router()

router.get('/answers', checkAdmin, answers.getAll)
router.get('/answers/temp', answers.getAllTempUserHasAccessTo)
router.get('/answers/:programme', requireProgrammeRead, answers.getOne)
router.get('/answers/:programme/previous', requireProgrammeRead, answers.getPreviousYear)
router.post('/answers', requireProgrammeWrite, answers.create)
router.post('/bulkanswers', answers.bulkCreate)

router.get('/programmes/:programme/tokens', requireProgrammeOwner, tokens.programmesTokens)
router.get('/programmes/:programme/users', requireProgrammeOwner, users.getProgrammesUsers)

router.post('/login', users.getCurrentUser)
router.post('/logout', users.getLogoutUrl)

router.get('/users', checkAdmin, users.getAllUsers)
router.put('/users/:id', checkAdmin, users.editUser)

router.post('/access/:url', tokens.claimToken)
router.get('/access/:url', tokens.checkToken)

module.exports = router
