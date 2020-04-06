// const jwt = require('jsonwebtoken')
// const { isAdmin, isShibboleth, JWT_SECRET } = require('@util/common')
const db = require('@models/index')

const usersAllowedToUseLoginAs = ['markokos', 'admin']

const currentUser = async (req, res, next) => {
  console.log(req.headers)

  let uid = req.headers.uid

  if (usersAllowedToUseLoginAs.includes(uid)) {
    const loggedInAs = req.headers['x-admin-logged-in-as']
    if (loggedInAs) {
      uid = loggedInAs
      let fakeUser = await db.user.findOne({ where: { uid } }).then((res) => res.dataValues)
      req.user = fakeUser
    }
  }
  next()
}

module.exports = currentUser
