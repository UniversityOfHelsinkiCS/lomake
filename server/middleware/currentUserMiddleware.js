const db = require('../models/index')

const { isAdmin } = require('../../config/common')

const currentUser = async (req, _, next) => {
  if (req.path.includes('/cypress/')) return next()

  if (isAdmin(req.user)) {
    const loggedInAs = req.headers['x-admin-logged-in-as']
    if (loggedInAs) {
      const fakeUser = await db.user.findOne({ where: { uid: loggedInAs } })

      req.user = fakeUser
    }
  }
  return next()
}

module.exports = currentUser
