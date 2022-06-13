const db = require('@models/index')

const { isSuperAdmin } = require('@root/config/common')

const currentUser = async (req, _, next) => {
  if (req.path.includes('/cypress/')) next()

  if (isSuperAdmin(req.user)) {
    const loggedInAs = req.headers['x-admin-logged-in-as']
    if (loggedInAs) {
      const fakeUser = await db.user.findOne({ where: { uid: loggedInAs } })

      req.user = fakeUser
    }
  }
  next()
}

module.exports = currentUser
