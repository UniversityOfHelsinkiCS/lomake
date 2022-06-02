const Router = require('express')
const users = require('@controllers/usersController')

const externalRouter = Router()

externalRouter.get('/organizations/:username', users.getUserOrganizations)

externalRouter.all('*', (req, res) => {
  res.send('400')
})

module.exports = externalRouter
