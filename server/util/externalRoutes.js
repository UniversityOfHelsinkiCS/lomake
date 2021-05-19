const Router = require('express')
const users = require('@controllers/usersController')

const externalRouter = Router()

externalRouter.get('/external/organizations/:username', users.getUserOrganizations)

externalRouter.get('/external', function (req, res) {
  res.send('400')
})

module.exports = externalRouter
