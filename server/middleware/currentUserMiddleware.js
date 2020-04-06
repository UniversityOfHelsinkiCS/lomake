// const jwt = require('jsonwebtoken')
// const { isAdmin, isShibboleth, JWT_SECRET } = require('@util/common')
const db = require('@models/index')

const currentUser = async (req, res, next) => {
  console.log(req.headers)

  let uid = req.headers.uid

  if (uid === 'admin') {
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
