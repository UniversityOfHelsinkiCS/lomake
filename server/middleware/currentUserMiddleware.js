const db = require('@models/index')

const SUPERADMINS = ['markokos', 'tgtapio', 'jehelen', 'mluukkai', 'admin']

const currentUser = async (req, res, next) => {
  let uid = req.headers.uid

  if (SUPERADMINS.includes(uid)) {
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
