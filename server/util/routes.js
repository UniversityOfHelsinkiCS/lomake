const Router = require('express')
const users = require('@controllers/usersController')
const answers = require('@controllers/answersController')
const tokens = require('@controllers/tokensController')
const { checkAdmin } = require('@middleware/accessControlMiddleware')

const router = Router()

router.get('/answers', checkAdmin, answers.getAll)
router.get('/answers/temp', checkAdmin, answers.getAllTemp)
router.get('/answers/:programme', answers.getOne)
router.get('/answers/:programme/previous', answers.getPreviousYear)
router.post('/answers', answers.create)
router.post('/bulkanswers', answers.bulkCreate)

router.post('/login', users.getCurrentUser)
router.post('/logout', users.getLogoutUrl)

router.get('/users', checkAdmin, users.getAllUsers)
router.put('/users/:id', checkAdmin, users.editUser)

router.post('/access/:url', tokens.claimToken)
router.get('/access/:url', tokens.checkToken)

module.exports = router
