const Router = require('express')
const forms = require('@controllers/formsController')

const router = Router()

router.get('/', (req, res) => res.send('welcome to root'))

router.get('/form', forms.getOne)
router.put('/form', forms.createOrUpdate)

module.exports = router
