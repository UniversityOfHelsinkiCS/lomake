const Router = require('express')
const forms = require('@controllers/formsController')
const users = require('@controllers/usersController')
const answers = require('@controllers/answersController')
const { checkAdmin } = require('@middleware/accessControlMiddleware')

const router = Router()

router.get('/', (req, res) => res.send('welcome to root'))

router.get('/form', forms.getOne)
router.put('/form', forms.createOrUpdate)

router.get('/answers', checkAdmin, answers.getAll)
router.post('/answers', answers.create)

router.post('/login', users.getCurrentUser)
router.post('/logout', users.getLogoutUrl)

router.get('/users', checkAdmin, users.getAllUsers)
router.put('/users/:id', checkAdmin, users.editUser)

module.exports = router
