const db = require('@models/index')

const { isSuperAdmin } = require('@root/config/common')

const currentUser = async (req, res, next) => {
  if (req.path.includes('/cypress/')) return next()
  let uid = req.headers.uid

  if (isSuperAdmin(uid)) {
    const loggedInAs = req.headers['x-admin-logged-in-as']
    if (loggedInAs) {
      let fakeUser = await db.user.findOne({ where: { uid: loggedInAs } })

      req.user = fakeUser
    }
  }
  next()
}

module.exports = currentUser
